"use client";

import { usePathname } from "next/navigation";
import React, { useState } from "react";
import Image from "next/image";
import { addCommentToBread } from "@/lib/actions/bread.actions";

interface Props {
  breadId: string;
  currentUserImg: string;
  currentUserId: string;
}

const Comment = ({ breadId, currentUserImg, currentUserId }: Props) => {
  const [comment, setComment] = useState(""); // State to store the comment
  const pathname = usePathname();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    await addCommentToBread(
            breadId,
            comment,
            JSON.parse(currentUserId),
            pathname
          );

    setComment(""); // Clear the comment input
  };

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setComment(event.target.value);
  };

  return (
    <div >
      <form onSubmit={handleSubmit}>
        <div className="flex w-full items-center gap-3">
          <label>
            <Image
              src={currentUserImg}
              alt="current_user"
              width={48}
              height={48}
              className="rounded-full object-cover"
            />
          </label>
          <div className="border-none bg-transparent">
            <input
              type="text"
              value={comment}
              onChange={handleCommentChange}
              placeholder="Comment..."
              className="no-focus outline-none rounded-lg"
            />
          </div>
          <button type="submit" className="comment-form_btn">
            Reply
          </button>
        </div>

      </form>
    </div>
  );
};

export default Comment;