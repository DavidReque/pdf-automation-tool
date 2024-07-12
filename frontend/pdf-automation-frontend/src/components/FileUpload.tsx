import { FileUploadPropsInterface } from "../types/types";

function FileUpload({onFileChange}: FileUploadPropsInterface) {
  return (
    <div className="">
      <input type="file" 
      accept="application/pdf"
      onChange={(e) => {
        if (e.target.files && e.target.files[0]) {
          onFileChange(e.target.files[0])
        }
      }}/>
    </div>
  );
}

export default FileUpload;