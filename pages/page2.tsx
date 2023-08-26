import { useEffect, useState } from "react";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import Slide from "@/components/Slide/Slide";
import { SlideType } from "@/src/constants";

export default function Page() {
  const [slides, setSlides] = useState<any[]>([]);
  const [editor, setEditor] = useState<string>("{}");
  const onEditorChange = (jsonstr: any) => {
    try {
      setEditor(jsonstr);
      console.log(jsonstr);
      const json = JSON.parse(jsonstr);

      console.log({ ...json.slides });
      setSlides([...json.slides]);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    console.log("Component mounted/updated");
    let Reveal: any;
    import("reveal.js").then((r) => {
      console.log("Reveal.js loaded");
      console.log(r.default);
      Reveal = r.default;
      Reveal.initialize({});
    });
    if (Reveal) {
      console.log("Reveal initialized");
      Reveal.initialize({});
    }

    return () => {
      console.log("Component unmounted");
      // @ts-ignore
      if (Reveal) {
        console.log(Reveal);
        // Reveal.destroy();
      }
    };
  });
  return (
    <>
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <>
          <div
            className="reveal"
            style={{
              border: "1px solid green",
              minWidth: "500px",
              width: "70%",
              height: "100%",
            }}
          >
            <div className="slides">
              <section>Intial Slide1</section>
              <section>Intial Slide2</section>
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
          {/* <Script id="my-script" src="/scripts/reveal.js"></Script> */}
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

Page.displayName = "Create Slide";
