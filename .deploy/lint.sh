#!/usr/bin/env bash
set -e;
shopt -s globstar;

base_dir=$(dirname "$0");
# shellcheck source=/dev/null
source "${base_dir}/shared.sh";

# get_opts() {
# 	while getopts ":n:v:o:" opt; do
# 	  case $opt in
# 			n) export opt_project_name="$OPTARG";
# 			;;
# 			v) export opt_version="$OPTARG";
# 			;;
# 			o) export opt_docker_org="$OPTARG";
# 			;;
# 			\?) echo "Invalid option -$OPTARG" >&2;
# 			exit 1;
# 			;;
# 		esac;
# 	done;
#
# 	return 0;
# };
#
# get_opts "$@";

WORKDIR="${WORKSPACE:-"$(pwd)"}"
__info "Running jshint";
ls -lfA "${WORKDIR}";
# shellcheck disable=SC2035
docker run --rm \
  -v "${WORKDIR}":/lint \
  -w /lint hyzual/jshint root/scripts/ --verbose;

__info "Running Dockerfile lint";
	docker run --rm \
		lukasmartinelli/hadolint < "${WORKDIR}/Dockerfile";


# __info "Running Phantombot lint";
# docker run --rm -v ${WORKDIR}:/source nacyot/javascript-rhino:apt rhino -f "/source/root/tests/index.js";
