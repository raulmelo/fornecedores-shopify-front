import Api from ".";

const ToolsServices = {
  fileUpload64: async (filename: string, attachment: string ) => {
    const response = await Api.post('utils/file-upload-base64', { filename, attachment });
    return response.data;
  }
}

export default ToolsServices;