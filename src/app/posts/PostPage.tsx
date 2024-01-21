"use client";

import React, { useState, useMemo } from "react";
import { api } from "@/trpc/react";

const Button: React.FC<{
  onClick: () => void;
  className: string;
  children: React.ReactNode;
}> = ({ onClick, className, children }) => (
  <button onClick={onClick} className={className}>
    {children}
  </button>
);

const Post: React.FC<{
  id: number;
  title: string;
  postBody: string;
  createdAt: Date;
  updatedAt: Date;
  handleVoting: (vote: "Like" | "Dislike", id: number) => void;
}> = ({ id, title, postBody, createdAt, updatedAt, handleVoting }) => {
  const formatDate = useMemo(
    () => (date: Date) => date.toLocaleDateString(),
    [],
  );
  return (
    <div className="mx-5 w-full rounded-md border p-5" key={id}>
      <div>{title}</div>
      <div>{postBody}</div>
      <div>Created on {formatDate(createdAt)}</div>
      <div>Updated on {formatDate(updatedAt)}</div>
      <div className="mt-5 flex items-center space-x-2">
        <Button
          onClick={() => handleVoting("Like", id)}
          className="rounded-md bg-yellow-800 p-2 text-white"
        >
          Like
        </Button>
        <Button
          onClick={() => handleVoting("Dislike", id)}
          className="rounded-md bg-red-800 p-2 text-white"
        >
          Dislike
        </Button>
      </div>
    </div>
  );
};

const PostPage: React.FC<{ userId: string }> = ({ userId }) => {
  const listPost = api.post.listPost.useQuery({
    start: 0,
    pageSize: 10,
  });
  const voting = api.vote.addVote.useMutation();
  const [loadingVotes, setLoadingVotes] = useState(false);
  const handleVoting = async (vote: "Like" | "Dislike", id: number) => {
    setLoadingVotes(true);
    try {
      await voting.mutateAsync({ postId: id, voteType: vote });
    } finally {
      setLoadingVotes(false);
    }
  };
  return (
    <div className="mx-auto mt-20 max-w-7xl">
      {listPost.data?.posts.map((post) => (
        <Post key={post.id} {...post} handleVoting={handleVoting} />
      ))}
      {loadingVotes && <div>Loading...</div>}
    </div>
  );
};

export default PostPage;
