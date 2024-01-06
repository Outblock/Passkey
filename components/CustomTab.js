import { Button, Tooltip } from "@nextui-org/react";
import { useState } from "react";
import { TAB } from "./Tab";

export const CustomTab = ({ setSelected, selected }) => {

  const TabButton = (tag, icon) => {
    return (
      <Tooltip showArrow={true} content={tag} className="dark" key={tag}>
        <Button
          key={`btn-${tag}`}
          isIconOnly
          size="xl"
          color="primary"
          variant={selected === tag ? "light" : "light"}
          onPress={() => {
            setSelected(tag);
          }}
          className="w-full h-full"
        >
          <div className={`text-2xl ${selected == tag ? "" : "text-gray-500"}`}>
            {icon}
          </div>
        </Button>
      </Tooltip>
    );
  };

  return (
    <div className="flex w-full gap-6 h-16">
      {TAB.map((tab) => TabButton(tab.id, tab.icon))}
    </div>
  );
};
