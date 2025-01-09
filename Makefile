.PHONY: all

all: css js

css:
	sass public --style compressed

js:
	uglifyjs public/js/index.js --compress --mangle reserved=[\'$\',\'DeleteTrackAt\',\'SetTrackAt\',\'GetTrackAt\',\'UpdateTrackAt\',\'UpdateVisibleTracks\',\'ImportTracks\',\'NormalizeTracks\'] --source-map base=\'public/js/\' --output public/js/index.min.js
	echo "//# sourceMappingURL=index.min.js.map" >> public/js/index.min.js

