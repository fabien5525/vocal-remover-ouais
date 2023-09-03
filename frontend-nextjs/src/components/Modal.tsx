import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import { useState } from "react";

interface AddModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const AddModal = (props: AddModalProps) => {
  const { open, setOpen } = props;
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    if (isLoading) {
      return;
    }
    setOpen(false);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();

    console.log("SUBMIT");

    if (value === "") {
      return;
    }

    setIsLoading(true);

    fetch("http://5525.fr:19001/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: value,
      }),
    }).then((res) => {
      setIsLoading(false);
      setValue("");
      if (res.status === 200) {
        handleClose();
      }
    });
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute" as "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Ajouter une musique
          </Typography>
          <TextField
            variant="outlined"
            label="Youtube URL"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={isLoading}
          />
          <Button variant="outlined" type="submit" disabled={isLoading}>
            {isLoading ? (
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            ) : (
              "Ajouter"
            )}
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default AddModal;
