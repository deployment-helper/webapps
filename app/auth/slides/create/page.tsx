"use client";

import Script from "next/script";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import { useEffect, useState } from "react";
import { Slide } from "@/components/Slide";
import { SlideType } from "@/src/constants";
import useSlidesStore from "../../store";

export default function Page() {
  const [slides, setSlides] = useState<any[]>([]);
  const [editor, setEditor] = useState<string>("{}");
  const addEditorFile = useSlidesStore((state) => state.addEditorFile);

  const onEditorChange = (jsonstr: any) => {
    try {
      setEditor(jsonstr);
      const json = JSON.parse(jsonstr);

      setSlides([...json.slides]);
      addEditorFile(json);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    console.log("Component mounted/updated");
    let Reveal: any;
    import("reveal.js").then((r) => {
      Reveal = r.default;
      Reveal.initialize({});
    });
    if (Reveal) {
      console.log("Reveal initialized");
      Reveal.initialize({});
    }
  });
  return (
    <>
      <div
        style={{
          width: "100%",
          height: "100%",
          minHeight: "600px",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <>
          <div
            className="reveal"
            style={{
              minWidth: "500px",
              width: "70%",
              height: "90vh",
            }}
          >
            <div className="slides">
              <section>Slide 1</section>
              <section>Slide 2</section>
              {slides.map((slide) => (
                <>
                  <Slide
                    key={slide.questionEn}
                    {...slide}
                    slideType={SlideType.QUESTION}
                  />
                  <Slide
                    key={slide.questionEn}
                    {...slide}
                    slideType={SlideType.OPTION_LIST}
                  />
                  <Slide
                    key={slide.questionEn}
                    {...slide}
                    slideType={SlideType.RIGHT_ANSWER}
                  />
                  <Slide
                    key={slide.questionEn}
                    {...slide}
                    slideType={SlideType.EXPLANATION}
                  />
                </>
              ))}
            </div>
          </div>
          <Script id="my-script">{`Reveal.initialize({});`}</Script>
        </>
        <div>
          <AceEditor
            height="100%"
            placeholder="Placeholder Text"
            mode="json"
            theme="github"
            name="blah2"
            onLoad={() => {
              console.log("Editor loaded");
            }}
            onChange={onEditorChange}
            fontSize={14}
            showPrintMargin={true}
            showGutter={true}
            highlightActiveLine={true}
            value={editor}
            setOptions={{
              enableBasicAutocompletion: false,
              enableLiveAutocompletion: false,
              enableSnippets: false,
              showLineNumbers: true,
              tabSize: 2,
            }}
          />
        </div>
      </div>
    </>
  );
}

Page.displayName = "CreateSlide";
