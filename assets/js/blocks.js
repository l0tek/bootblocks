/* global wp */
(function () {
  const { registerBlockType } = wp.blocks;
  const { __ } = wp.i18n;
  const { Fragment, useEffect } = wp.element;
  const {
    RichText,
    InspectorControls,
    URLInputButton,
    MediaUpload,
    MediaUploadCheck,
    useBlockProps,
  } = wp.blockEditor;
  const { PanelBody, Button, TextControl, RangeControl } = wp.components;

  const ensureId = (clientId, uniqueId, setAttributes, prefix) => {
    useEffect(() => {
      if (!uniqueId) {
        setAttributes({ uniqueId: `${prefix}-${clientId.slice(0, 8)}` });
      }
    }, [clientId, uniqueId]);
  };

  const applyHeroDefaults = (attributes, setAttributes) => {
    if (!window.bootblocksDefaults) return;
    const defaults = window.bootblocksDefaults;
    const updates = {};

    if (!attributes.backgroundUrl && defaults.heroBackgroundUrl) {
      updates.backgroundUrl = defaults.heroBackgroundUrl;
    }
    if (
      attributes.overlayOpacity === 0.55 &&
      typeof defaults.heroOverlay === "number"
    ) {
      updates.overlayOpacity = defaults.heroOverlay;
    }
    if (attributes.buttonStyle === "light" && defaults.heroButtonStyle) {
      updates.buttonStyle = defaults.heroButtonStyle;
    }
    if (attributes.align === "center" && defaults.heroAlign) {
      updates.align = defaults.heroAlign;
    }
    if (Object.keys(updates).length) {
      setAttributes(updates);
    }
  };

  registerBlockType("bootblocks/hero", {
    title: __("Hero", "bootblocks"),
    icon: "cover-image",
    category: "bootblocks",
    attributes: {
      heading: { type: "string", source: "html", selector: "h1" },
      text: { type: "string", source: "html", selector: "p" },
      buttonText: { type: "string", source: "html", selector: ".btn" },
      buttonUrl: { type: "string", default: "" },
      backgroundUrl: { type: "string", default: "" },
      backgroundAlt: { type: "string", default: "" },
      overlayOpacity: { type: "number", default: 0.55 },
      buttonStyle: { type: "string", default: "light" },
      align: { type: "string", default: "center" },
    },
    edit({ attributes, setAttributes }) {
      useEffect(() => {
        applyHeroDefaults(attributes, setAttributes);
      }, []);

      const alignClass =
        attributes.align === "start" || attributes.align === "end"
          ? attributes.align
          : "center";
      const blockProps = useBlockProps({
        className: `bootblocks-hero bootblocks-hero-image text-${alignClass} py-5 rounded-3`,
      });
      return wp.element.createElement(
        Fragment,
        null,
        wp.element.createElement(
          InspectorControls,
          null,
          wp.element.createElement(
            PanelBody,
            { title: __("Hero Settings", "bootblocks") },
            wp.element.createElement(RangeControl, {
              label: __("Overlay Opacity", "bootblocks"),
              min: 0,
              max: 0.9,
              step: 0.05,
              value: attributes.overlayOpacity,
              onChange: (value) => setAttributes({ overlayOpacity: value }),
            }),
          ),
        ),
        wp.element.createElement(
          "section",
          {
            ...blockProps,
            style: attributes.backgroundUrl
              ? { backgroundImage: `url(${attributes.backgroundUrl})` }
              : undefined,
          },
          wp.element.createElement("div", {
            className: "bootblocks-hero__overlay",
            style: { opacity: attributes.overlayOpacity },
          }),
          wp.element.createElement(
            "div",
            { className: "container py-4 position-relative" },
            wp.element.createElement(
              "div",
              { className: "d-flex justify-content-center mb-3" },
              wp.element.createElement(
                MediaUploadCheck,
                null,
                wp.element.createElement(MediaUpload, {
                  onSelect: (media) =>
                    setAttributes({
                      backgroundUrl: media.url,
                      backgroundAlt: media.alt || "",
                    }),
                  allowedTypes: ["image"],
                  render: ({ open }) =>
                    wp.element.createElement(
                      Button,
                      { onClick: open, variant: "secondary", size: "small" },
                      attributes.backgroundUrl
                        ? __("Replace Background", "bootblocks")
                        : __("Select Background", "bootblocks"),
                    ),
                }),
              ),
            ),
            !attributes.backgroundUrl
              ? wp.element.createElement(
                  "div",
                  { className: "bootblocks-editor-note" },
                  __("Choose a background image for the hero.", "bootblocks"),
                )
              : null,
            wp.element.createElement(RichText, {
              tagName: "h1",
              className: "display-5 fw-bold text-white",
              value: attributes.heading,
              placeholder: __("Hero headline...", "bootblocks"),
              onChange: (value) => setAttributes({ heading: value }),
            }),
            wp.element.createElement(RichText, {
              tagName: "p",
              className: "lead text-white-50",
              value: attributes.text,
              placeholder: __("Hero copy...", "bootblocks"),
              onChange: (value) => setAttributes({ text: value }),
            }),
            wp.element.createElement(
              "div",
              { className: "d-flex flex-column align-items-center gap-2" },
              wp.element.createElement(RichText, {
                tagName: "span",
                className: `btn btn-${attributes.buttonStyle || "light"} btn-lg`,
                value: attributes.buttonText,
                placeholder: __("Button text", "bootblocks"),
                onChange: (value) => setAttributes({ buttonText: value }),
              }),
              wp.element.createElement(URLInputButton, {
                url: attributes.buttonUrl,
                onChange: (url) => setAttributes({ buttonUrl: url }),
              }),
            ),
          ),
        ),
      );
    },
    save({ attributes }) {
      const alignClass =
        attributes.align === "start" || attributes.align === "end"
          ? attributes.align
          : "center";
      const blockProps = wp.blockEditor.useBlockProps.save({
        className: `bootblocks-hero bootblocks-hero-image text-${alignClass} py-5 rounded-3`,
      });
      return wp.element.createElement(
        "section",
        {
          ...blockProps,
          style: attributes.backgroundUrl
            ? { backgroundImage: `url(${attributes.backgroundUrl})` }
            : undefined,
        },
        wp.element.createElement("div", {
          className: "bootblocks-hero__overlay",
          style: { opacity: attributes.overlayOpacity },
        }),
        wp.element.createElement(
          "div",
          { className: "container py-4 position-relative" },
          wp.element.createElement(RichText.Content, {
            tagName: "h1",
            className: "display-5 fw-bold text-white",
            value: attributes.heading,
          }),
          wp.element.createElement(RichText.Content, {
            tagName: "p",
            className: "lead text-white-50",
            value: attributes.text,
          }),
          attributes.buttonText
            ? wp.element.createElement(
                "a",
                {
                  className: `btn btn-${attributes.buttonStyle || "light"} btn-lg`,
                  href: attributes.buttonUrl || "#",
                },
                attributes.buttonText,
              )
            : null,
        ),
      );
    },
  });

  registerBlockType("bootblocks/card-grid", {
    title: __("Card Grid", "bootblocks"),
    icon: "screenoptions",
    category: "bootblocks",
    attributes: {
      columns: { type: "number", default: 3 },
      cards: {
        type: "array",
        default: [
          {
            title: "Card title",
            text: "Card copy goes here.",
            imageUrl: "",
            imageAlt: "",
            buttonText: "Mehr",
            buttonUrl: "",
          },
          {
            title: "Card title",
            text: "Card copy goes here.",
            imageUrl: "",
            imageAlt: "",
            buttonText: "Mehr",
            buttonUrl: "",
          },
          {
            title: "Card title",
            text: "Card copy goes here.",
            imageUrl: "",
            imageAlt: "",
            buttonText: "Mehr",
            buttonUrl: "",
          },
        ],
      },
    },
    edit({ attributes, setAttributes }) {
      const blockProps = useBlockProps({ className: "bootblocks-card-grid" });
      const updateCard = (index, updates) => {
        const next = attributes.cards.map((card, i) =>
          i === index ? { ...card, ...updates } : card,
        );
        setAttributes({ cards: next });
      };
      const addCard = () => {
        setAttributes({
          cards: [
            ...attributes.cards,
            {
              title: "Card title",
              text: "Card copy goes here.",
              imageUrl: "",
              imageAlt: "",
              buttonText: "Mehr",
              buttonUrl: "",
            },
          ],
        });
      };
      const removeCard = (index) => {
        const next = attributes.cards.filter((_, i) => i !== index);
        setAttributes({ cards: next.length ? next : attributes.cards });
      };

      return wp.element.createElement(
        Fragment,
        null,
        wp.element.createElement(
          InspectorControls,
          null,
          wp.element.createElement(
            PanelBody,
            { title: __("Grid Settings", "bootblocks") },
            wp.element.createElement(RangeControl, {
              label: __("Columns", "bootblocks"),
              min: 2,
              max: 4,
              value: attributes.columns,
              onChange: (value) => setAttributes({ columns: value }),
            }),
          ),
        ),
        wp.element.createElement(
          "section",
          blockProps,
          wp.element.createElement(
            "div",
            {
              className: `row row-cols-1 row-cols-md-${attributes.columns} g-4`,
            },
            attributes.cards.map((card, index) =>
              wp.element.createElement(
                "div",
                { className: "col", key: index },
                wp.element.createElement(
                  "div",
                  { className: "card h-100 p-2" },
                  wp.element.createElement(
                    "div",
                    { className: "mb-2" },
                    wp.element.createElement(
                      MediaUploadCheck,
                      null,
                      wp.element.createElement(MediaUpload, {
                        onSelect: (media) =>
                          updateCard(index, {
                            imageUrl: media.url,
                            imageAlt: media.alt || "",
                          }),
                        allowedTypes: ["image"],
                        render: ({ open }) =>
                          wp.element.createElement(
                            Button,
                            {
                              onClick: open,
                              variant: "secondary",
                              size: "small",
                            },
                            card.imageUrl
                              ? __("Replace Image", "bootblocks")
                              : __("Select Image", "bootblocks"),
                          ),
                      }),
                    ),
                    card.imageUrl
                      ? wp.element.createElement("img", {
                          className: "card-img-top mt-2",
                          src: card.imageUrl,
                          alt: card.imageAlt || "",
                        })
                      : null,
                  ),
                  wp.element.createElement(RichText, {
                    tagName: "h5",
                    className: "card-title",
                    value: card.title,
                    placeholder: __("Card title", "bootblocks"),
                    onChange: (value) => updateCard(index, { title: value }),
                  }),
                  wp.element.createElement(RichText, {
                    tagName: "p",
                    className: "card-text",
                    value: card.text,
                    placeholder: __("Card text", "bootblocks"),
                    onChange: (value) => updateCard(index, { text: value }),
                  }),
                  wp.element.createElement(RichText, {
                    tagName: "span",
                    className: "btn btn-outline-primary btn-sm",
                    value: card.buttonText,
                    placeholder: __("Button text", "bootblocks"),
                    onChange: (value) =>
                      updateCard(index, { buttonText: value }),
                  }),
                  wp.element.createElement(URLInputButton, {
                    url: card.buttonUrl,
                    onChange: (url) => updateCard(index, { buttonUrl: url }),
                  }),
                  wp.element.createElement(
                    "div",
                    { className: "mt-2" },
                    wp.element.createElement(
                      Button,
                      { variant: "link", onClick: () => removeCard(index) },
                      __("Remove Card", "bootblocks"),
                    ),
                  ),
                ),
              ),
            ),
          ),
          wp.element.createElement(
            "div",
            { className: "mt-3" },
            wp.element.createElement(
              Button,
              { variant: "primary", onClick: addCard },
              __("Add Card", "bootblocks"),
            ),
          ),
        ),
      );
    },
    save({ attributes }) {
      const blockProps = wp.blockEditor.useBlockProps.save({
        className: "bootblocks-card-grid",
      });
      return wp.element.createElement(
        "section",
        blockProps,
        wp.element.createElement(
          "div",
          { className: `row row-cols-1 row-cols-md-${attributes.columns} g-4` },
          attributes.cards.map((card, index) =>
            wp.element.createElement(
              "div",
              { className: "col", key: index },
              wp.element.createElement(
                "div",
                { className: "card h-100" },
                card.imageUrl
                  ? wp.element.createElement("img", {
                      className: "card-img-top",
                      src: card.imageUrl,
                      alt: card.imageAlt || "",
                    })
                  : null,
                wp.element.createElement(
                  "div",
                  { className: "card-body" },
                  wp.element.createElement(RichText.Content, {
                    tagName: "h5",
                    className: "card-title",
                    value: card.title,
                  }),
                  wp.element.createElement(RichText.Content, {
                    tagName: "p",
                    className: "card-text",
                    value: card.text,
                  }),
                  card.buttonText
                    ? wp.element.createElement(
                        "a",
                        {
                          className: "btn btn-outline-primary btn-sm",
                          href: card.buttonUrl || "#",
                        },
                        card.buttonText,
                      )
                    : null,
                ),
              ),
            ),
          ),
        ),
      );
    },
  });

  registerBlockType("bootblocks/accordion", {
    title: __("Accordion", "bootblocks"),
    icon: "list-view",
    category: "bootblocks",
    attributes: {
      uniqueId: { type: "string", default: "" },
      items: {
        type: "array",
        default: [
          { title: "Accordion title", content: "Accordion content." },
          { title: "Accordion title", content: "Accordion content." },
          { title: "Accordion title", content: "Accordion content." },
        ],
      },
    },
    edit({ attributes, setAttributes, clientId }) {
      ensureId(clientId, attributes.uniqueId, setAttributes, "accordion");
      const blockProps = useBlockProps({ className: "bootblocks-accordion" });

      const updateItem = (index, updates) => {
        const next = attributes.items.map((item, i) =>
          i === index ? { ...item, ...updates } : item,
        );
        setAttributes({ items: next });
      };
      const addItem = () => {
        setAttributes({
          items: [
            ...attributes.items,
            { title: "Accordion title", content: "Accordion content." },
          ],
        });
      };
      const removeItem = (index) => {
        const next = attributes.items.filter((_, i) => i !== index);
        setAttributes({ items: next.length ? next : attributes.items });
      };

      return wp.element.createElement(
        "section",
        blockProps,
        wp.element.createElement(
          "div",
          { className: "accordion", id: attributes.uniqueId || "accordion" },
          attributes.items.map((item, index) =>
            wp.element.createElement(
              "div",
              { className: "accordion-item", key: index },
              wp.element.createElement(
                "h2",
                { className: "accordion-header" },
                wp.element.createElement(RichText, {
                  tagName: "button",
                  className: `accordion-button${index === 0 ? "" : " collapsed"}`,
                  value: item.title,
                  placeholder: __("Accordion title", "bootblocks"),
                  onChange: (value) => updateItem(index, { title: value }),
                }),
              ),
              wp.element.createElement(
                "div",
                {
                  className: `accordion-collapse collapse${index === 0 ? " show" : ""}`,
                },
                wp.element.createElement(
                  "div",
                  { className: "accordion-body" },
                  wp.element.createElement(RichText, {
                    tagName: "p",
                    value: item.content,
                    placeholder: __("Accordion content", "bootblocks"),
                    onChange: (value) => updateItem(index, { content: value }),
                  }),
                ),
              ),
              wp.element.createElement(
                "div",
                { className: "px-3 pb-2" },
                wp.element.createElement(
                  Button,
                  { variant: "link", onClick: () => removeItem(index) },
                  __("Remove item", "bootblocks"),
                ),
              ),
            ),
          ),
        ),
        wp.element.createElement(
          "div",
          { className: "mt-3" },
          wp.element.createElement(
            Button,
            { variant: "primary", onClick: addItem },
            __("Add item", "bootblocks"),
          ),
        ),
      );
    },
    save({ attributes }) {
      const blockProps = wp.blockEditor.useBlockProps.save({
        className: "bootblocks-accordion",
      });
      const accordionId = attributes.uniqueId || "accordion";
      return wp.element.createElement(
        "section",
        blockProps,
        wp.element.createElement(
          "div",
          { className: "accordion", id: accordionId },
          attributes.items.map((item, index) => {
            const headingId = `${accordionId}-heading-${index}`;
            const collapseId = `${accordionId}-collapse-${index}`;
            return wp.element.createElement(
              "div",
              { className: "accordion-item", key: index },
              wp.element.createElement(
                "h2",
                { className: "accordion-header", id: headingId },
                wp.element.createElement(
                  "button",
                  {
                    className: `accordion-button${index === 0 ? "" : " collapsed"}`,
                    type: "button",
                    "data-bs-toggle": "collapse",
                    "data-bs-target": `#${collapseId}`,
                    "aria-expanded": index === 0 ? "true" : "false",
                    "aria-controls": collapseId,
                  },
                  item.title,
                ),
              ),
              wp.element.createElement(
                "div",
                {
                  id: collapseId,
                  className: `accordion-collapse collapse${index === 0 ? " show" : ""}`,
                  "aria-labelledby": headingId,
                  "data-bs-parent": `#${accordionId}`,
                },
                wp.element.createElement(
                  "div",
                  { className: "accordion-body" },
                  wp.element.createElement(RichText.Content, {
                    tagName: "p",
                    value: item.content,
                  }),
                ),
              ),
            );
          }),
        ),
      );
    },
  });

  registerBlockType("bootblocks/tabs", {
    title: __("Tabs", "bootblocks"),
    icon: "index-card",
    category: "bootblocks",
    attributes: {
      uniqueId: { type: "string", default: "" },
      activeIndex: { type: "number", default: 0 },
      items: {
        type: "array",
        default: [
          { label: "Tab 1", content: "Tab content." },
          { label: "Tab 2", content: "Tab content." },
          { label: "Tab 3", content: "Tab content." },
        ],
      },
    },
    edit({ attributes, setAttributes, clientId }) {
      ensureId(clientId, attributes.uniqueId, setAttributes, "tabs");
      const blockProps = useBlockProps({ className: "bootblocks-tabs" });

      const updateItem = (index, updates) => {
        const next = attributes.items.map((item, i) =>
          i === index ? { ...item, ...updates } : item,
        );
        setAttributes({ items: next });
      };
      const addItem = () => {
        setAttributes({
          items: [
            ...attributes.items,
            { label: "Tab", content: "Tab content." },
          ],
        });
      };
      const removeItem = (index) => {
        const next = attributes.items.filter((_, i) => i !== index);
        setAttributes({ items: next.length ? next : attributes.items });
      };

      return wp.element.createElement(
        Fragment,
        null,
        wp.element.createElement(
          InspectorControls,
          null,
          wp.element.createElement(
            PanelBody,
            { title: __("Tabs Settings", "bootblocks") },
            wp.element.createElement(RangeControl, {
              label: __("Active tab", "bootblocks"),
              min: 0,
              max: Math.max(0, attributes.items.length - 1),
              value: attributes.activeIndex,
              onChange: (value) => setAttributes({ activeIndex: value }),
            }),
          ),
        ),
        wp.element.createElement(
          "section",
          blockProps,
          wp.element.createElement(
            "ul",
            { className: "nav nav-tabs" },
            attributes.items.map((item, index) =>
              wp.element.createElement(
                "li",
                { className: "nav-item", key: index },
                wp.element.createElement(RichText, {
                  tagName: "span",
                  className: `nav-link${index === attributes.activeIndex ? " active" : ""}`,
                  value: item.label,
                  placeholder: __("Tab label", "bootblocks"),
                  onChange: (value) => updateItem(index, { label: value }),
                }),
              ),
            ),
          ),
          wp.element.createElement(
            "div",
            { className: "tab-content border border-top-0 p-3" },
            attributes.items.map((item, index) =>
              wp.element.createElement(
                "div",
                {
                  className: `tab-pane fade${index === attributes.activeIndex ? " show active" : ""}`,
                  key: index,
                },
                wp.element.createElement(RichText, {
                  tagName: "p",
                  value: item.content,
                  placeholder: __("Tab content", "bootblocks"),
                  onChange: (value) => updateItem(index, { content: value }),
                }),
                wp.element.createElement(
                  Button,
                  { variant: "link", onClick: () => removeItem(index) },
                  __("Remove tab", "bootblocks"),
                ),
              ),
            ),
          ),
          wp.element.createElement(
            "div",
            { className: "mt-3" },
            wp.element.createElement(
              Button,
              { variant: "primary", onClick: addItem },
              __("Add tab", "bootblocks"),
            ),
          ),
        ),
      );
    },
    save({ attributes }) {
      const blockProps = wp.blockEditor.useBlockProps.save({
        className: "bootblocks-tabs",
      });
      const tabsId = attributes.uniqueId || "tabs";
      return wp.element.createElement(
        "section",
        blockProps,
        wp.element.createElement(
          "ul",
          { className: "nav nav-tabs", role: "tablist" },
          attributes.items.map((item, index) =>
            wp.element.createElement(
              "li",
              { className: "nav-item", role: "presentation", key: index },
              wp.element.createElement(
                "button",
                {
                  className: `nav-link${index === attributes.activeIndex ? " active" : ""}`,
                  id: `${tabsId}-tab-${index}`,
                  type: "button",
                  role: "tab",
                  "data-bs-toggle": "tab",
                  "data-bs-target": `#${tabsId}-panel-${index}`,
                  "aria-controls": `${tabsId}-panel-${index}`,
                  "aria-selected":
                    index === attributes.activeIndex ? "true" : "false",
                },
                item.label,
              ),
            ),
          ),
        ),
        wp.element.createElement(
          "div",
          { className: "tab-content border border-top-0 p-3" },
          attributes.items.map((item, index) =>
            wp.element.createElement(
              "div",
              {
                className: `tab-pane fade${index === attributes.activeIndex ? " show active" : ""}`,
                id: `${tabsId}-panel-${index}`,
                role: "tabpanel",
                "aria-labelledby": `${tabsId}-tab-${index}`,
                key: index,
              },
              wp.element.createElement(RichText.Content, {
                tagName: "p",
                value: item.content,
              }),
            ),
          ),
        ),
      );
    },
  });

  registerBlockType("bootblocks/carousel", {
    title: __("Carousel", "bootblocks"),
    icon: "images-alt2",
    category: "bootblocks",
    attributes: {
      uniqueId: { type: "string", default: "" },
      interval: { type: "number", default: 5000 },
      height: { type: "number", default: 500 },
      slides: {
        type: "array",
        default: [
          {
            imageUrl: "",
            imageAlt: "",
            heading: "Slide title",
            text: "Slide copy goes here.",
          },
          {
            imageUrl: "",
            imageAlt: "",
            heading: "Slide title",
            text: "Slide copy goes here.",
          },
          {
            imageUrl: "",
            imageAlt: "",
            heading: "Slide title",
            text: "Slide copy goes here.",
          },
        ],
      },
    },
    edit({ attributes, setAttributes, clientId }) {
      ensureId(clientId, attributes.uniqueId, setAttributes, "carousel");
      const blockProps = useBlockProps({ className: "bootblocks-carousel" });
      const updateSlide = (index, updates) => {
        const next = attributes.slides.map((slide, i) =>
          i === index ? { ...slide, ...updates } : slide,
        );
        setAttributes({ slides: next });
      };
      const addSlide = () => {
        setAttributes({
          slides: [
            ...attributes.slides,
            {
              imageUrl: "",
              imageAlt: "",
              heading: "Slide title",
              text: "Slide copy goes here.",
            },
          ],
        });
      };
      const removeSlide = (index) => {
        const next = attributes.slides.filter((_, i) => i !== index);
        setAttributes({ slides: next.length ? next : attributes.slides });
      };

      return wp.element.createElement(
        Fragment,
        null,
        wp.element.createElement(
          InspectorControls,
          null,
          wp.element.createElement(
            PanelBody,
            { title: __("Carousel Settings", "bootblocks") },
            wp.element.createElement(TextControl, {
              label: __("Interval (ms)", "bootblocks"),
              type: "number",
              value: attributes.interval,
              onChange: (value) =>
                setAttributes({ interval: parseInt(value, 10) || 0 }),
            }),
            wp.element.createElement(RangeControl, {
              label: __("Height (px)", "bootblocks"),
              min: 300,
              max: 900,
              step: 10,
              value: attributes.height || 500,
              onChange: (value) =>
                setAttributes({ height: parseInt(value, 10) || 500 }),
            }),
          ),
        ),
        wp.element.createElement(
          "section",
          {
            ...blockProps,
            style: {
              "--bootblocks-carousel-height": `${attributes.height || 500}px`,
            },
          },
          attributes.slides.map((slide, index) =>
            wp.element.createElement(
              "div",
              { className: "border rounded-3 p-3 mb-3", key: index },
              wp.element.createElement(
                MediaUploadCheck,
                null,
                wp.element.createElement(MediaUpload, {
                  onSelect: (media) =>
                    updateSlide(index, {
                      imageUrl: media.url,
                      imageAlt: media.alt || "",
                    }),
                  allowedTypes: ["image"],
                  render: ({ open }) =>
                    wp.element.createElement(
                      Button,
                      { onClick: open, variant: "secondary", size: "small" },
                      slide.imageUrl
                        ? __("Replace Image", "bootblocks")
                        : __("Select Image", "bootblocks"),
                    ),
                }),
              ),
              slide.imageUrl
                ? wp.element.createElement("img", {
                    className: "img-fluid rounded mt-2",
                    src: slide.imageUrl,
                    alt: slide.imageAlt || "",
                  })
                : null,
              wp.element.createElement(RichText, {
                tagName: "h5",
                className: "mt-2",
                value: slide.heading,
                placeholder: __("Slide title", "bootblocks"),
                onChange: (value) => updateSlide(index, { heading: value }),
              }),
              wp.element.createElement(RichText, {
                tagName: "p",
                value: slide.text,
                placeholder: __("Slide text", "bootblocks"),
                onChange: (value) => updateSlide(index, { text: value }),
              }),
              wp.element.createElement(
                Button,
                { variant: "link", onClick: () => removeSlide(index) },
                __("Remove slide", "bootblocks"),
              ),
            ),
          ),
          wp.element.createElement(
            "div",
            { className: "mt-3" },
            wp.element.createElement(
              Button,
              { variant: "primary", onClick: addSlide },
              __("Add slide", "bootblocks"),
            ),
          ),
        ),
      );
    },
    save() { return null; },
  });
})();
