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
	Style.ts \
	Meta.ts \
	Bao.ts

JS_FILES=$(TS_FILES:%.ts=$(MODULEDIR)/Bao/%.js)

.PHONY: all lint

all: lint $(JS_FILES) all-recursive

lint: $(TS_FILES)
	[ `which tslint` ] && tslint -c $(TOPSRCDIR)/tslint.json $(TS_FILES)

$(MODULEDIR)/Bao/%.js: %.ts
	$(TSC) -d --declarationDir $(TOPSRCDIR)/node_modules/Bao --outDir $(TOPSRCDIR)/node_modules/Bao/ $<

clean: clean-recursive
	rm -rf $(MODULEDIR)/Bao
