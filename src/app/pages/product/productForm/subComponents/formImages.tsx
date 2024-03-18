import { useCallback, useEffect, useState } from "react";
import { ImagesProductTypes } from "src/app/types/Products.types";
import { DropZone, Icon, LegacyStack, Text, Thumbnail } from "@shopify/polaris";
import { XCircleIcon } from '@shopify/polaris-icons';
import './formImages.scss';
import { TitleToSlug } from "src/app/utilities/slug-url";


interface IProductsImagesFormsProps {
  setImages: ImagesProductTypes[]
  outputImages: (images: any) => void
  onRemoveImages: (images: any) => void
}


export default function ProductsImagesForms(props: IProductsImagesFormsProps) {
  const { setImages = [] } = props;
  const [images, setImagesState] = useState<ImagesProductTypes[]>(setImages);
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    setImagesState(setImages);
  }, [props.setImages]);


  useEffect(() => {
    listBase64();
  }, [files]);

   const handleDrop = useCallback(
    (_droppedFiles: File[], acceptedFiles: File[]) => {
        setFiles((files) => [...files, ...acceptedFiles]);
    },
    [],
  );

  function deleteImage(image: ImagesProductTypes) {
    console.log('deleteImage', image)
    const newImages = images.filter(item => item.src !== image.src);
    setImagesState(newImages);
    props.onRemoveImages(newImages);

  }


  const listBase64 = (): any => {
    const __images: any = []
    files.forEach((file:any) => {
      // Verifica se o arquivo é uma imagem
      if (!file.type.startsWith("image/")) {
        alert("Apenas imagens são permitidas!")
        return;
      }
      const reader = new FileReader();
      const format = file.type.split('/')[1]

      reader.onload = (e) => {
        if (e.target?.result) {
          __images.push({
            attachment: e.target?.result,
            filename: TitleToSlug(file.name) + '.' + format
          })
          props.outputImages(__images);
        }
      };

      reader.onerror = (error) => {
        console.error("Erro ao ler o arquivo: ", error);
      };
      reader.readAsDataURL(file);
    });
  }

  const uploadedFiles = files.length > 0 && (
    <LegacyStack vertical>
      {files.map((file, index) => (
        <LegacyStack alignment="center" key={index}>
          <Thumbnail
            size="small"
            alt={file.name}
            source={window.URL.createObjectURL(file)}
          />
          <div>
            {file.name}{' '}
            <Text variant="bodySm" as="p">
              {file.size} bytes
            </Text>
          </div>
        </LegacyStack>
      ))}
    </LegacyStack>
  );

  return <>
    <Text variant="headingMd" as="h5">
      Imagens: {images.length}/5
    </Text>
    <div className="flex mt-2 gap-5 flex-wrap">
      {images.length ? images.map((item, index) => (
        <div key={index} className="cardImageForm border h-[200px] w-[200px] object-contain">
          <img src={item.src} />
          <button 
            type="button"
            onClick={() => deleteImage(item)}
          >
            <Icon
              source={XCircleIcon}
              tone="base"
            />
          </button>
        </div>
      )) : <Text as="h4">Adicione imagens</Text>}
      <div className="w-full">
      {images.length < 5 && 
        <DropZone 
          accept="image/*"
          onDrop={handleDrop}
          label="Theme files"
        >
          {uploadedFiles}
          <DropZone.FileUpload
            actionHint="Apenas imagem"
          />
        </DropZone>
      }
      </div>
    </div>
  </>
}