#!groovy
import com.bit13.jenkins.*

if(env.BRANCH_NAME ==~ /master$/) {
		return
}


node ("docker") {
	def ProjectName = "phantombot-beta-panel"
	def slack_notify_channel = null

	def MAJOR_VERSION = 1
	def MINOR_VERSION = 0


	properties ([
		buildDiscarder(logRotator(numToKeepStr: '25', artifactNumToKeepStr: '25')),
		disableConcurrentBuilds(),
		pipelineTriggers([
			pollSCM('H/30 * * * *')
		]),
	])

	env.PROJECT_MAJOR_VERSION = MAJOR_VERSION
	env.PROJECT_MINOR_VERSION = MINOR_VERSION

	env.CI_BUILD_VERSION = Branch.getSemanticVersion(this)
	env.CI_DOCKER_ORGANIZATION = "bit13labs"
	env.CI_ORGANIZATION = "bit13labs"
	env.CI_PROJECT_NAME = ProjectName
	currentBuild.result = "SUCCESS"

	def errorMessage = null
	wrap([$class: 'TimestamperBuildWrapper']) {
		wrap([$class: 'AnsiColorBuildWrapper', colorMapName: 'xterm']) {
			Notify.slack(this, "STARTED", null, slack_notify_channel)
			try {
				withCredentials([[$class: 'StringBinding', credentialsId: env.CI_GNTP_CREDENTIAL_ID, variable: 'GNTP_PASSWORD']]) {
					withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: env.CI_ARTIFACTORY_CREDENTIAL_ID,
													usernameVariable: 'ARTIFACTORY_USERNAME', passwordVariable: 'ARTIFACTORY_PASSWORD']]) {
						stage ("install" ) {
							deleteDir()
							Branch.checkout(this, env.CI_PROJECT_NAME, env.CI_DOCKER_ORGANIZATION)
							Pipeline.install(this)
						}
						stage ("lint") {
							sh script: "${WORKSPACE}/.deploy/lint.sh -n '${env.CI_PROJECT_NAME}' -v '${env.CI_BUILD_VERSION}' -o '${env.CI_DOCKER_ORGANIZATION}'"
						}
						stage ("build") {
							sh script: "${WORKSPACE}/.deploy/build.sh -n '${env.CI_PROJECT_NAME}' -v '${env.CI_BUILD_VERSION}' -o '${env.CI_DOCKER_ORGANIZATION}'"
						}
						stage ("test") {
							sh script: "${WORKSPACE}/.deploy/test.sh -n '${env.CI_PROJECT_NAME}' -v '${env.CI_BUILD_VERSION}' -o '${env.CI_DOCKER_ORGANIZATION}'"
						}
						stage ("deploy") {
							sh script: "${WORKSPACE}/.deploy/deploy.sh -n '${env.CI_PROJECT_NAME}' -v '${env.CI_BUILD_VERSION}' -o '${env.CI_DOCKER_ORGANIZATION}'"
						}
						stage ('publish') {
							// this only will publish if the incominh branch IS develop
							Branch.publish_to_master(this)
							Pipeline.publish_buildInfo(this)
							Pipeline.upload_artifact(this, "dist/${env.CI_PROJECT_NAME}-${env.CI_BUILD_VERSION}.zip", "generic-local/${env.CI_PROJECT_NAME}/${env.CI_BUILD_VERSION}/${env.CI_PROJECT_NAME}-${env.CI_BUILD_VERSION}.zip", "")
							Pipeline.upload_artifact(this, "dist/${env.CI_PROJECT_NAME}-${env.CI_BUILD_VERSION}.zip", "generic-local/${env.CI_PROJECT_NAME}/latest/${env.CI_PROJECT_NAME}-latest.zip", "")
							Pipeline.publish_github(this, env.CI_ORGANIZATION, env.CI_PROJECT_NAME, env.CI_BUILD_VERSION, "${WORKSPACE}/dist/${env.CI_PROJECT_NAME}-${env.CI_BUILD_VERSION}.zip", false, false)
						}
					}
				}
			} catch(err) {
				currentBuild.result = "FAILURE"
				errorMessage = err.message
				throw err
			}
			finally {
				Pipeline.finish(this, currentBuild.result, errorMessage)
			}
		}
	}
}
