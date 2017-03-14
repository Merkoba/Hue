#!/bin/sh
#description: find dominant colors in images
#usage: dcolors image-file

#example: dcolors black-and-white-image.png
#output 3 dominant colors in rgb format
#191,191,191
#80,80,80
#185,185,185

#original python implementation
#http://charlesleifer.com/blog/using-python-and-k-means-to-find-the-dominant-colors-in-images/

_usage() {
    printf "Usage: %s\\n" "$(expr "${0}" : '.*/\([^/]*\)') [options] image-file ..."
    printf "%s\\n" "Find dominant colors in images."
    printf "\\n"
    printf "%s\\n" "  -d, --deviation   deviation, higher value, faster computation, default 1"
    printf "%s\\n" "  -k, --kmeans      output colors, default 3"
    printf "%s\\n" "  -r, --resize      resize before procedure, lower value, faster computation, default 25x25"
    printf "%s\\n" "  -f, --format      output format [rgb|hex], default rgb"
    printf "%s\\n" "  -h, --help        show this help message and exit"
}

_die() {
    [ -z "${1}" ] || printf "%s\\n" "${*}" >&2
    _usage >&2; exit 1
}

_is_int() {
    #look for an integer, returns 0 on success, 1 otherwise
    #http://www.unix.com/shell-programming-and-scripting/172070-help-scripting-command.html
    case "${1}" in
        *[!0-9]*|"") return 1 ;;
    esac
}

_false() {
    return 1
}

_kmeans_awk() {
    awk_prog='
    function _euclidean(p1,p2) {
        split(p1, p1_coordinates, ",")
        split(p2, p2_coordinates, ",")
        _euclidean__distance=0
        for (coordinate=1; coordinate <= 3; coordinate++) {
                        #skip alpha channels
            remains=p1_coordinates[coordinate] - p2_coordinates[coordinate]
            _euclidean__distance+=remains * remains
            #_euclidean__distance+=remains^2 #doesnt work on ubuntu busybox awk
        }
        return _euclidean__distance
    }

    function _calculate_center(plist) {
        plist_array_len=split(plist, plist_array)
        sumX=0; sumY=0; sumZ=0;
        for (point in plist_array) {
            split(plist_array[point], coordinates, ",")
            for (coordinate in coordinates) {
                if (coordinate == 1) {
                    split(coordinates[coordinate], composed_coordinate, ":")
                    times=composed_coordinate[1]
                    coordinateX=composed_coordinate[2]
                    sumX+=coordinateX*times
                }
                else if (coordinate == 2) sumY+=coordinates[coordinate] * times
                else if (coordinate == 3) sumZ+=coordinates[coordinate] * times
            }
        }
        sumX=int(sumX/plist_array_len)
        sumY=int(sumY/plist_array_len)
        sumZ=int(sumZ/plist_array_len)
        return sumX "," sumY "," sumZ
    }

    function _max(value1, value2) {
        if (value1 > value2) return value1
        else return value2
    }

    function _randint(n) { return 1 + int(rand() * n) }

    { points_times=points_times $0 " " }

    END {
        #print points_times
        points=points_times
        #remove time field to improve computation performance
        gsub(/[0-9]?[0-9]?[0-9]?[0-9]?[0-9]?[0-9]?:/,"", points)

        points_times_array_len=split(points_times, points_times_array)
        split(points, points_array)

        #get random sample
        srand(); for (i = 1; i <= kmeans; i++) {
            clusters_array[i]=points_array[_randint(points_times_array_len)]
            #print clusters_array[i]
        }

        while (1) {
            for (p in points_array) {
                distance=0; for (i = 1; i<= kmeans; i++) {
                    distance = _euclidean(points_array[p], clusters_array[i])
                    if (i == 1) { smallest_distance=distance; idx=1 }
                    else if (distance < smallest_distance) {
                        smallest_distance=distance
                        idx=i
                    }
                    #print points_array[p] " " clusters_array[i] " " distance " " smallest_distance
                }
                plists[idx]=plists[idx] points_times_array[p] " "
                #print idx
                #print "============"
            }

            #print plists[1]
            #print "======================"
            #print plists[2]
            #print "======================"
            #print plists[3]
            #print "======================"
            #print plists[4]
            #print "======================"

            diff = 0; for (item in clusters_array) old_clusters_array[item]=clusters_array[item]
            for (c in clusters_array) {
                clusters_array[c] = _calculate_center(plists[c])
                diff = _max(diff, _euclidean(old_clusters_array[c], clusters_array[c]))
            }

            #if (1) break
            if (diff < deviation) {
                for (c in clusters_array) {
                    if (format == "rgb") print clusters_array[c]
                    else {
                        split(clusters_array[c], cluster, ",")
                        printf "#"
                        for (coordinate in cluster) printf "%02X", cluster[coordinate]
                        print ""
                    }
                }
                break
            }
        }
    }'

    for image; do
        if [ -f "${image}" ]; then
            image_points_times="$(convert "${image}" -resize "${resize}" \
                -colorspace RGB -depth 8 -format %c histogram:info:- |   \
                ${awk_bin} \
                'NF {sub(/\).*/,"");sub(/\(/,"");gsub(/ /,"");print $0}')"

            printf "%s" "${image_points_times}" | ${awk_bin}      \
                -v kmeans="${kmeans}" -v deviation="${deviation}" \
                -v format="${format}" "${awk_prog}"
        else
            printf "%s\\n" "Warning: '${image}' doesn't exist, skipping..." >&2
            _false
        fi
    done
}

_check_deps() {
    if command -v "awk" >/dev/null 2>&1; then
        awk_bin="awk"
    elif busybox awk 1 /dev/null >/dev/null 2>&1; then
        awk_bin="busybox awk"
    else
        printf "%s\\n" "install 'awk' to run this program" >&2
        exit 1
    fi

    if ! command -v "convert" >/dev/null 2>&1; then
        printf "%s\\n" "install 'convert' to run this program" >&2
        exit 1
    fi
}

_sanitize_parameters(){
    if [ -z "${kmeans}" ]; then
        kmeans="3"
    else
        _is_int "${kmeans}" || _die "Option -k|--kmeans requires a number parameter '${kmeans}'"
    fi

    if [ -z "${deviation}" ]; then
        deviation="1"
    else
        _is_int "${deviation}" || _die "Option -d|--deviation requires a number parameter '${deviation}'"
    fi

    if [ -z "${format}" ]; then
        format="rgb"
    else
        case "${format}" in
            rgb|hex) : ;;
            *) _die "Output valid formats are rgb|hex: '${format}'" ;;
        esac
    fi

    [ -z "${resize}" ] && resize="25x25"
}

if [ ! -t 0 ]; then
    #there is input comming from pipe or file, add to the end of $@
    set -- "${@}" $(cat)
fi

for arg; do #parse options
    case "${arg}" in
        -h|--help) _usage && exit ;;
        '-d'|'--deviation')
            if [ "${#}" -gt "1" ]; then
                case "${2}" in
                    -*) _die "Option '${arg}' requires a parameter" ;;
                esac
                shift; deviation="${1}"; [ "${1}" ] && shift
            else
                _die "Option '${arg}' requires a parameter"
            fi ;;
        -d*) deviation="${1#-d}"; shift ;;
        --deviation*) deviation="${1#--deviation}"; shift ;;
        '-k'|'--kmeans')
            if [ "${#}" -gt "1" ]; then
                case "${2}" in
                    -*) _die "Option '${arg}' requires a parameter" ;;
                esac
                shift; kmeans="${1}"; [ "${1}" ] && shift
            else
                _die "Option '${arg}' requires a parameter"
            fi ;;
        -k*) kmeans="${1#-k}"; shift ;;
        --kmeans*) kmeans="${1#--kmeans}"; shift ;;
        '-r'|'--resize')
            if [ "${#}" -gt "1" ]; then
                case "${2}" in
                    -*) _die "Option '${arg}' requires a parameter"
                esac
                shift; resize="${1}"; [ "${1}" ] && shift
            else
                _die "Option '${arg}' requires a parameter"
            fi ;;
        -r*) resize="${1#-r}"; shift ;;
        --resize*) resize="${1#--resize}"; shift ;;
        '-f'|'--format')
            if [ "${#}" -gt "1" ]; then
                case "${2}" in
                    -*) _die "Option '${arg}' requires a parameter"
                esac
                shift; format="${1}"; [ "${1}" ] && shift
            else
                _die "Option '${arg}' requires a parameter"
            fi ;;
        -f*) format="${1#-f}"; shift ;;
        --format*) format="${1#--format}"; shift ;;
        -*) _die "$(expr "${0}" : '.*/\([^/]*\)'): unrecognized option '${arg}'" ;;
    esac
done

_check_deps && _sanitize_parameters && [ "${#}" -eq "0" ] && _die

_kmeans_awk "${@}"