import {
  SelectTabData,
  SelectTabEvent,
  Tab,
  TabList,
} from "@fluentui/react-tabs";
import { useEffect, useRef, useState } from "react";
import Image from "@/components/Image/Image";
import html2canvas from "html2canvas";
import layouts from "@/src/layouts";
import { useVideoStore } from "@/src/stores/video.store";
import { IInput } from "@/src/types/types";
import { ServerClient } from "@/src/apis/server.client";
import {
  getApiServer,
  getLayoutContent,
  s3RandomPublicKey,
} from "@/src/helpers";
import { useMutationUpdateScene } from "@/src/query/video.query";
import { useParams } from "next/navigation";
import { debounce } from "lodash";

let debounceContent: any = undefined;
let debounceImage: any = undefined;
const SceneEditor = (props: ISceneEditorProps) => {
  const [activeTab, setActiveTab] = useState("1");
  const currentLayoutId = useVideoStore((state) => state.selectedLayoutId);
  const setCurrentLayoutId = useVideoStore(
    (state) => state.setSelectedLayoutId,
  );
  const selectedSceneId = useVideoStore((state) => state.selectedSceneId);
  const sceneContent = useVideoStore((state) => state.sceneContent);
  const params = useParams();

  // React component to render the selected layout
  const [LayoutReactComponent, setLayoutReactComponent] = useState<
    React.FunctionComponent<any> | undefined
  >(undefined);

  const [contentTemplate, setContentTemplate] = useState<
    Record<string, IInput>
  >({});

  const compRef = useRef<HTMLDivElement | null>(null);

  const { mutate: updateScene } = useMutationUpdateScene();

  // Select tab
  const onTabSelect = (e: SelectTabEvent, data: SelectTabData) => {
    setActiveTab(data.value as string);
  };

  // Update scene content

  const updateSceneContent = () => {
    if (debounceContent) {
      debounceContent.cancel();
    }
    debounceContent = debounce(updateScene, 1000);
    debounceContent({
      id: params.video_id as string,
      sceneId: selectedSceneId,
      data: { content: contentTemplate },
      invalidate: false,
    });
  };

  // Select layout
  const onLayoutSelect = (layoutId: string) => {
    setCurrentLayoutId(layoutId);
    if (layoutId !== currentLayoutId) {
      const layout = layouts.find((layout) => layout.id === layoutId);
      const newContentTemplate = JSON.parse(JSON.stringify(layout?.content));
      setContentTemplate(newContentTemplate);
    }
  };

  // When image is uploaded to S3 update image URL to content template
  const onUploadSuccess = (url: string, name: string) => {
    setContentTemplate((prev) => ({
      ...prev,
      [name]: { ...prev[name], value: url },
    }));
    createImage();
    updateSceneContent();
  };

  // Create image with selected layout and content template with canvas APIs and upload to S3
  const createImage = () => {
    if (debounceImage) {
      debounceImage.cancel();
    }
    debounceImage = debounce(() => {
      const ref = document.getElementById(selectedSceneId);
      html2canvas(ref as HTMLElement, {
        useCORS: true,
        logging: true,
      }).then((canvas) => {
        const img = document.getElementById("canvas") as HTMLImageElement;
        const dataUrl = canvas.toDataURL("image/png");
        img.src = dataUrl;
        ServerClient.uploadCanvasImageToS3(
          getApiServer(),
          s3RandomPublicKey(),
          dataUrl,
          true,
        ).then((res) => {
          if (res.publicUrl) {
            updateScene({
              id: params.video_id as string,
              sceneId: selectedSceneId,
              layoutId: currentLayoutId,
              data: {
                image: res.publicUrl,
              },
              isInvalidate: true,
            });
          }
        });
      });
    }, 2000);
    debounceImage();
  };

  // Listener for content data change and update the content in state
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContentTemplate((prev) => {
      return {
        ...prev,
        [e.target.name]: { ...prev[e.target.name], value: e.target.value },
      };
    });
    createImage();
    updateSceneContent();
  };

  // Dynamically import layout component for selected layout
  useEffect(() => {
    const layout = layouts.find((layout) => layout.id === currentLayoutId);
    if (!layout) return;
    const LayoutReactComponent =
      require(`@/components/layouts/${layout?.componentName}`).default;
    setLayoutReactComponent(LayoutReactComponent);
  }, [currentLayoutId]);

  // Set local content template
  useEffect(() => {
    if (
      currentLayoutId &&
      selectedSceneId &&
      sceneContent &&
      Object.keys(sceneContent).length > 0
    ) {
      setContentTemplate(sceneContent);
    } else if (currentLayoutId) {
      const newContentTemplate = getLayoutContent(currentLayoutId);
      newContentTemplate && setContentTemplate(newContentTemplate);
    } else {
      setCurrentLayoutId(layouts[0].id);
      const newContentTemplate = JSON.parse(JSON.stringify(layouts[0].content));
      setContentTemplate(newContentTemplate);
    }
  }, [currentLayoutId, layouts]);

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
                  layouts.find((layout) => layout.id === currentLayoutId)?.image
                }
                alt={currentLayoutId}
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
                      layout.id === currentLayoutId
                        ? "border-2 border-blue-500"
                        : ""
                    }`}
                    src={layout.image}
                    alt={layout.id}
                    onClick={() => onLayoutSelect(layout.id)}
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
              {contentTemplate && LayoutReactComponent && (
                <LayoutReactComponent
                  isNone={true}
                  ref={compRef}
                  sceneId={selectedSceneId}
                  content={contentTemplate}
                />
              )}
            </div>

            <hr className={"my-4"} />
            <div className={"flex flex-col"}>
              {contentTemplate &&
                Object.entries(contentTemplate).map(([key, value]) => (
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

export interface ISceneEditorProps {}

export { SceneEditor };
export default SceneEditor;
