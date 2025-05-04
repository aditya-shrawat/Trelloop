import React, { useState } from "react";
import EditAttachment from "./EditAttachment";
import { ImLink } from "react-icons/im";
import { HiDotsHorizontal } from "react-icons/hi";

const AttachmentContainer = ({link,setAttachments,index}) => {
    const [editAttachment,setEditAttachment] = useState(false)


  return (
    <div
      className="p-2 mt-2 bg-gray-100 rounded-lg border-[1px] border-gray-300 flex justify-between items-center "
    >
      <div className="flex items-center w-full">
        <div>
          <ImLink className="mr-3 text-base text-gray-700" />
        </div>
        <a
          href={link}
          className="w-full text-[#0C66E4] cursor-pointer hover:underline"
        >
          {link}
        </a>
      </div>
      <div className="relative w-fit">
        <div
          onClick={() => {
            setEditAttachment(true);
          }}
          className="text-gray-700 rounded-md p-1 cursor-pointer"
        >
          <HiDotsHorizontal />
        </div>
        {editAttachment && (
          <EditAttachment setEditAttachment={setEditAttachment} link={link} setAttachments={setAttachments} index={index} />
        )}
      </div>
    </div>
  );
};

export default AttachmentContainer;
