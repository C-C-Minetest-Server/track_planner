.PHONY: all

all: css js

css:
	sass public --style compressed

js:
	uglifyjs public/js/index.js --compress --mangle reserved=[\'$\',\'DeleteTrackAt\',\'SetTrackAt\',\'GetTrackAt\',\'UpdateTrackAt\',\'UpdateVisibleTracks\',\'ImportTracks\',\'NormalizeTracks\'] --mangle-props --source-map --output public/js/index.min.js

