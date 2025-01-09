.PHONY: all

all: css js html

css:
	sass public --style compressed

js:
	uglifyjs public/js/index.js --compress --mangle reserved=[\'$\',\'DeleteTrackAt\',\'SetTrackAt\',\'GetTrackAt\',\'UpdateTrackAt\',\'UpdateVisibleTracks\',\'ImportTracks\',\'NormalizeTracks\'] --source-map base=\'public/js/\' --output public/js/index.min.js
	echo "//# sourceMappingURL=index.min.js.map" >> public/js/index.min.js

html:
	html-minifier --collapse-whitespace --remove-comments --remove-optional-tags --remove-redundant-attributes --remove-script-type-attributes --remove-tag-whitespace --use-short-doctype --minify-css true --minify-js true public/index.original.html > public/index.html
