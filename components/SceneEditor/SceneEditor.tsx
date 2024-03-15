import {
  SelectTabData,
  SelectTabEvent,
  Tab,
  TabList,
} from "@fluentui/react-tabs";
import { useEffect, useRef, useState } from "react";
import { ILayout } from "@/src/types/types";
import Image from "@/components/Image/Image";
import { TitleSubtitle } from "@/components/layouts";
import html2canvas from "html2canvas";

const SceneEditor = (props: ISceneEditorProps) => {
  const [activeTab, setActiveTab] = useState("1");
  const [currentLayoutId, setCurrentLayoutId] = useState(props.currentLayoutId);
  const [LayoutReactComponent, setLayoutReactComponent] = useState<
    React.FunctionComponent<any> | undefined
  >(undefined);
  const [content, setContent] = useState(props.layouts[0].content);
  const compRef = useRef<HTMLDivElement | null>(null);
  const onTabSelect = (e: SelectTabEvent, data: SelectTabData) => {
    setActiveTab(data.value as string);
  };

  const onLayoutSelect = (layoutId: string) => {
    setCurrentLayoutId(layoutId);
    setContent(
      props.layouts.find((layout) => layout.id === layoutId)?.content || {},
    );
  };

  const onUploadSuccess = (url: string, name: string) => {
    setContent((prev) => ({
      ...prev,
      [name]: { ...prev[name], value: url },
    }));
  };

  const createImage = () => {
    const ref = document.getElementById(props.currentSceneId as string);
    html2canvas(ref as HTMLElement, {
      useCORS: true,
      logging: true,
    }).then((canvas) => {
      const img = document.getElementById("canvas") as HTMLImageElement;
      img.src = canvas.toDataURL("image/png");
      props.onSceneContentChange &&
        props.onSceneContentChange(
          props.currentSceneId as string,
          canvas.toDataURL("image/png"),
        );
    });
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent((prev) => ({
      ...prev,
      [e.target.name]: { ...prev[e.target.name], value: e.target.value },
    }));
  };

  useEffect(() => {
    const layout = props.layouts.find(
      (layout) => layout.id === currentLayoutId,
    );
    const LayoutReactComponent =
      require(`@/components/layouts/${layout?.componentName}`).default;
    setLayoutReactComponent(LayoutReactComponent);
  }, [currentLayoutId]);

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
                  props.layouts.find((layout) => layout.id === currentLayoutId)
                    ?.image
                }
                alt={currentLayoutId}
              />
            </div>

            {/*Render layouts*/}
            <h2>Layouts</h2>
            <div className={"flex flex-wrap"}>
              {props.layouts.map((layout) => (
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
              <h2>Canvas</h2>
              <img id={"canvas"} src={""} />
              {LayoutReactComponent && (
                <LayoutReactComponent
                  isNone={true}
                  ref={compRef}
                  sceneId={props.currentSceneId}
                  content={content}
                />
              )}
            </div>
            <button className={"bg-amber-200"} onClick={createImage}>
              Create Image
            </button>
            <hr className={"my-4"} />
            <div className={"flex flex-col"}>
              {Object.entries(content).map(([key, value]) => (
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
  currentLayoutId: string;
  currentSceneId?: string;
  layouts: Array<ILayout>;
  onSceneContentChange?: (sceneId: string, content: any) => void;
}

export { SceneEditor };
export default SceneEditor;
