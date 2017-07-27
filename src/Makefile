TOPSRCDIR=..
include $(TOPSRCDIR)/config.mak

SUBDIRS=Media

TS_FILES=Core.ts \
	View.ts \
	Menu.ts \
	DataStore.ts \
	Focus.ts \
	Ajax.ts \
	Carousel.ts \
	List.ts \
	Grid.ts \
	Style.ts \
	Meta.ts \
	Bao.ts

JS_FILES=$(TS_FILES:%.ts=$(MODULEDIR)/bao-framework/%.js)

.PHONY: all lint

all: lint $(JS_FILES) all-recursive

lint: $(TS_FILES)
	[ `which tslint` ] && tslint -c $(TOPSRCDIR)/tslint.json $(TS_FILES)

$(MODULEDIR)/bao-framework/%.js: %.ts
	$(TSC) -d --declarationDir $(TOPSRCDIR)/node_modules/bao-framework --outDir $(TOPSRCDIR)/node_modules/bao-framework/ $<

clean: clean-recursive
	rm -rf $(MODULEDIR)/bao-framework
