TOPSRCDIR=.
include $(TOPSRCDIR)/config.mak

.PHONY: all clean link

SUBDIRS=src

all: all-recursive
	rm -rf dist
	mkdir -p dist
	cp -r node_modules/bao-framework dist/bao-framework

clean: clean-recursive
	rm -rf node_modules dist

link:
	rm -rf /usr/local/lib/node_modules/bao-framework/
	cp -r dist/bao-framework /usr/local/lib/node_modules/
