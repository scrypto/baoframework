TOPSRCDIR?=.
TSC=tsc -t ES3 --baseUrl $(TOPSRCDIR)/node_modules
PACK=browserify
ifeq (, $(shell which uglifyjs))
MINIFY=uglifyjs2 -c -m --mangle-props 2 --lint=false
else
MINIFY=uglifyjs -c -m --lint=false
endif
PACKER=$(TOPSRCDIR)/tools/packer

DESTDIR?=$(TOPSRCDIR)/dist
MODULEDIR=$(TOPSRCDIR)/node_modules

default: all

all-recursive:
	@for x in $(SUBDIRS); do make -C $$x all || exit 1; done

clean-recursive:
	@for x in $(SUBDIRS); do make -C $$x clean || exit 1; done

lib: $(TOPSRCDIR)/src/*.js
	make -C $(TOPSRCDIR)/src
