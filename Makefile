MOCHA_OPTS = --check-leaks --watch
REPORTER = dot

check: test

test: test-unit

test-unit:
	@NODE_ENV=test ./node_modules/.bin/mocha \
	  	--reporter $(REPORTER) \
		$(MOCHA_OPTS)

test-watch:
	@NODE_ENV=test ./node_modules/.bin/mocha \
	  	--reporter $(REPORTER) \
		$(MOCHA_OPTS)
	



.PHONY: test test-watch clean

