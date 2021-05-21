DISCOURSE_DIR="../discourse"
UCD_DIR=$(pwd)

run_tests () {
  QUNIT_RAILS_ENV=development d/rake "themes:qunit[name,Unformatted Code Detector]"
}

cd $DISCOURSE_DIR

run_tests

while true; do
  inotifywait -r -e modify,create,delete,attrib $UCD_DIR/test $UCD_DIR/javascripts
  sleep 1 # wait for changes to persist to Discourse instance
  run_tests
done
