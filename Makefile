.PHONY: all

all: css js

css:
	sass public --style compressed

js:
	uglifyjs public/js/index.js --source-map --output public/js/index.min.js

