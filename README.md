# Advtrains Track Planner

## Build

```bash
sudo npm install -g sass uglify-js html-minifier
make all
```

As the scripts uses AJAX, you can't load the track planner from `file:///`. You should use a web server, e.g.:

```bash
python -m http.server --directory public/
```
