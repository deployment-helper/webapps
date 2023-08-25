import Script from "next/script";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";

export default function Page() {
  return (
    <>
      <div
        style={{
          width: "100%",
          height: "100%",
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
              <section>Slide 1</section>
              <section>Slide 2</section>
            </div>
          </div>
          <Script id="my-script">{`Reveal.initialize({});`}</Script>
        </>
        <div>
          <AceEditor
            placeholder="Placeholder Text"
            mode="json"
            theme="github"
            name="blah2"
            onLoad={() => {
              console.log("Editor loaded");
            }}
            onChange={(data) => {
              console.log(data);
            }}
            fontSize={14}
            showPrintMargin={true}
            showGutter={true}
            highlightActiveLine={true}
            value={`function onLoad(editor) {
                    console.log("i've loaded");
                  }`}
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
