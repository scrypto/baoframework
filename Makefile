TOPSRCDIR=.
include $(TOPSRCDIR)/config.mak

.PHONY: all clean

SUBDIRS=src

all: all-recursive
	rm -rf lib
	mkdir -p dist
	mv node_modules/Bao dist/bao-framework

clean: clean-recursive
	rm -rf node_modules dist
