import {
  SelectTabData,
  SelectTabEvent,
  Tab,
  TabList,
} from "@fluentui/react-tabs";
import { useState } from "react";
import { debounce } from "lodash";

import Image from "@/components/Image/Image";
import html2canvas from "html2canvas";
import layouts from "@/src/layouts";
import { useVideoStore } from "@/src/stores/video.store";
import { ServerClient } from "@/src/apis/server.client";
import { getApiServer, s3RandomPublicKey } from "@/src/helpers";
import { useMutationUpdateScene } from "@/src/query/video.query";
import { useParams } from "next/navigation";

import { IInput } from "@/src/types/types";
import RenderLayoutComponent from "@/components/RenderLayoutComponent/RenderLayoutComponent";

let debounceContent: any = undefined;
let debounceImage: any = undefined;
const SceneEditor = ({ sceneDocId }: ISceneEditorProps) => {
  const [activeTab, setActiveTab] = useState("1");
  const selectedLayoutId = useVideoStore((state) => state.selectedLayoutId);
  const selectedSceneId = useVideoStore((state) => state.selectedSceneId);
  const sceneContent = useVideoStore((state) => state.sceneContent);
  const sceneArrayIndex = useVideoStore((state) => state.sceneArrayIndex);
  const setSceneContent = useVideoStore((state) => state.setSceneContent);
  const params = useParams();

  const { mutate: updateScene } = useMutationUpdateScene();

  // Select tab
  const onTabSelect = (e: SelectTabEvent, data: SelectTabData) => {
    setActiveTab(data.value as string);
  };

  // Update scene content on server
  const updateSceneContent = (content?: Record<string, IInput>) => {
    if (debounceContent) {
      debounceContent.cancel();
    }
    debounceContent = debounce(updateScene, 1000);
    debounceContent({
      id: params.video_id as string,
      sceneId: sceneDocId,
      sceneArrayIndex,
      data: { content: content || sceneContent },
      invalidate: false,
    });
  };

  // Select layout
  const onLayoutChange = (layoutId: string) => {
    if (layoutId !== selectedLayoutId) {
      const layout = layouts.find((layout) => layout.id === layoutId);
      const newContentTemplate = JSON.parse(JSON.stringify(layout?.content));
      setSceneContent(
        layoutId,
        selectedSceneId,
        sceneArrayIndex,
        newContentTemplate,
      );
    }
  };

  // When image is uploaded to S3 update image URL to content template
  const onUploadSuccess = (url: string, name: string) => {
    console.log("url", url);
    setSceneContent(selectedLayoutId, selectedSceneId, sceneArrayIndex, {
      ...sceneContent,
      [name]: {
        ...sceneContent[name],
        value: url,
      },
    });
    console.log("sceneContent", sceneContent);
    createImage();
    updateSceneContent({
      ...sceneContent,
      [name]: {
        ...sceneContent[name],
        value: url,
      },
    });
  };

  // Create image with selected layout and content template with canvas APIs and upload to S3
  const createImage = () => {
    if (debounceImage) {
      debounceImage.cancel();
    }
    debounceImage = debounce(() => {
      console.log("Canvas image creation started");
      const ref = document.getElementById(selectedSceneId);
      html2canvas(ref as HTMLElement, {
        useCORS: true,
        allowTaint: true,
        logging: true,
      }).then((canvas) => {
        const img = document.getElementById("canvas") as HTMLImageElement;
        const dataUrl = canvas.toDataURL("image/png");
        img.src = dataUrl;
        console.log("Uploading to S3");
        ServerClient.uploadCanvasImageToS3(
          getApiServer(),
          s3RandomPublicKey(),
          dataUrl,
          true,
        ).then((res) => {
          console.log("Updating scene");
          if (res.publicUrl) {
            updateScene({
              id: params.video_id as string,
              sceneId: sceneDocId,
              layoutId: selectedLayoutId,
              sceneArrayIndex,
              data: {
                image: res.publicUrl,
              },
            });
          }
        });
      });
    }, 2000);
    debounceImage();
  };

  // Listener for content data change and update the content in state
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSceneContent(selectedLayoutId, selectedSceneId, sceneArrayIndex, {
      ...sceneContent,
      [e.target.name]: {
        ...sceneContent[e.target.name],
        value: e.target.value,
      },
    });
    createImage();
    updateSceneContent();
  };

  return (
    <div className={"p-4"}>
      <h1 className={"text-xl"}>Scene Editor</h1>
      <TabList
        className={"border-b-2 border-b-gray-500"}
        selectedValue={activeTab}
        onTabSelect={onTabSelect}
      >
        <Tab value={"1"}>Layout</Tab>
        <Tab value={"2"}>Content</Tab>
      </TabList>
      <div>
        {/*Layouts*/}
        {activeTab === "1" && (
          // render current layout
          <>
            <div>
              <h2>Current Layout</h2>
              <img
                style={{ width: "200px" }}
                src={
                  layouts.find((layout) => layout.id === selectedLayoutId)
                    ?.image
                }
                alt={selectedLayoutId}
              />
            </div>

            {/*Render layouts*/}
            <h2>Layouts</h2>
            <div className={"flex flex-wrap"}>
              {layouts.map((layout) => (
                <div key={layout.id}>
                  <img
                    style={{ width: "200px", cursor: "pointer" }}
                    className={`p-0.5 ${
                      layout.id === selectedLayoutId
                        ? "border-2 border-blue-500"
                        : ""
                    }`}
                    src={layout.image}
                    alt={layout.id}
                    onClick={() => onLayoutChange(layout.id)}
                  />
                </div>
              ))}
            </div>
          </>
        )}

        {/*Content*/}
        {activeTab === "2" && (
          <>
            <div>
              <img id={"canvas"} src={""} />
              <RenderLayoutComponent
                isNone={true}
                content={sceneContent}
                sceneId={selectedSceneId}
                layoutId={selectedLayoutId}
              />
            </div>

            <hr className={"my-4"} />
            <div className={"flex flex-col"}>
              {sceneContent &&
                Object.entries(sceneContent).map(([key, value]) => (
                  <div key={key} className={"flex flex-col"}>
                    <label className={"capitalize"} htmlFor={key}>
                      {key}
                    </label>
                    {value.type === "input" ? (
                      <input
                        onChange={onInputChange}
                        type={value.type}
                        name={value.name}
                        value={value.value}
                        placeholder={value.placeholder}
                      />
                    ) : (
                      <Image
                        src={value.value}
                        onUploadSuccess={(url?: string) => {
                          onUploadSuccess(url || "", value.name);
                        }}
                      />
                    )}
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export interface ISceneEditorProps {
  sceneDocId: string;
}

export { SceneEditor };
export default SceneEditor;
