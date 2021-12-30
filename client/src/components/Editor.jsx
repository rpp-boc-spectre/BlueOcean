import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import LayerPlayer from "./LayerPlayer";

export default function Editor() {

  const [modalIsOpen, setModalIsOpen] = useState();

  return (
    <>
      <Typography variant="h3">Editor Component</Typography>
      <LayerPlayer />
    </>
  )
}