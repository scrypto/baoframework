TOPSRCDIR=.
include $(TOPSRCDIR)/config.mak

.PHONY: all clean deps VERSION

SUBDIRS=src test apps

all: all-recursive

clean: clean-recursive
	rm -rf node_modules dist
