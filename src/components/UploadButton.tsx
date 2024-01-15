"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Upload } from "lucide-react";

const UploadButton = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) {
          setIsOpen(v);
        }
      }}
    >
      <DialogTrigger onClick={() => setIsOpen(true)} asChild>
        <Button
          variant="default"
          className="bg-orange-600 text-white hover:bg-orange-500 gap-1 flex items-center justify-center"
        >
          <Upload size={20} />
          <span> Upload PDF</span>
        </Button>
      </DialogTrigger>

      <DialogContent>Your Content</DialogContent>
    </Dialog>
  );
};

export default UploadButton;
