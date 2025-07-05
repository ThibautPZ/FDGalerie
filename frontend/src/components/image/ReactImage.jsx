import { useImage } from "react-image";
import { isFunction, isPromise } from "../../services/typesAndValidationChecks";
import tranlationInstance from "../../services/translationInstance";

export default function ReactImage({
  srcList,
  imgPromise,
  noSuspense = false,
  onLoading, // useless if noSuspense = false
  onError,
}) {
  const tCommon = tranlationInstance("common:images");
  const useImageParams = { srcList };
  if (isPromise(imgPromise)) {
    Object.assign(useImageParams, { imgPromise });
  }
  if (noSuspense) {
    Object.assign(useImageParams, { useSuspense: false });
  }

  const { src, error, isLoading } = useImage(useImageParams);

  if (isFunction(onLoading) && isLoading) {
    onLoading();
  }
  if (isFunction(onError) && error) {
    onError();
  }

  return <img src={src} alt={tCommon("miniPaintingAlt")} />;
}
