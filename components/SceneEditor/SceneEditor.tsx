import {
  SelectTabData,
  SelectTabEvent,
  SelectTabEventHandler,
  Tab,
  TabList,
} from "@fluentui/react-tabs";
import { useState } from "react";
import { ILayout } from "@/src/types";

const SceneEditor = (props: ISceneEditorProps) => {
  const [activeTab, setActiveTab] = useState("1");
  const [currentLayoutId, setCurrentLayoutId] = useState(props.currentLayoutId);
  const [content, setContent] = useState(props.layouts[0].content);
  const onTabSelect = (e: SelectTabEvent, data: SelectTabData) => {
    setActiveTab(data.value as string);
  };

  const onLayoutSelect = (layoutId: string) => {
    setCurrentLayoutId(layoutId);
    setContent(
      props.layouts.find((layout) => layout.id === layoutId)?.content || {},
    );
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
          <div className={"flex flex-col"}>
            {Object.entries(content).map(([key, value]) => (
              <div key={key} className={"flex flex-col"}>
                <label className={"capitalize"} htmlFor={key}>
                  {key}
                </label>
                {value.type === "input" ? (
                  <input
                    type={value.type}
                    name={value.name}
                    value={value.value}
                    placeholder={value.placeholder}
                  />
                ) : (
                  <img src={value.value} alt={value.placeholder} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export interface ISceneEditorProps {
  currentLayoutId: string;
  layouts: Array<ILayout>;
}

export { SceneEditor };
export default SceneEditor;
