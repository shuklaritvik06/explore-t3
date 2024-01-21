"use client";

import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const router = useRouter();

  const addPost = api.post.createPost.useMutation();
  const handleAddPost = () => {
    addPost.mutate({
      title: title,
      postBody: body,
    });
    router.replace("/posts");
  };
  return (
    <div className="mx-auto mt-20 flex max-w-4xl flex-col gap-4">
      <input
        type="text"
        name="postTitle"
        id=""
        className="rounded-md border p-4"
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        name="postBody"
        id=""
        className="rounded-md border"
        onChange={(e) => setBody(e.target.value)}
      />
      <button onClick={handleAddPost}>Add Post</button>
    </div>
  );
};

export default CreatePost;
