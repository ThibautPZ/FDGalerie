import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import axios from "axios";

import { isStringNotEmpty } from "../../services/typesAndValidationChecks";
import FallbackImg from "./FallbackImg";

export default function FetchImage({ url, name }) {
  const [objectUrl, setObjectUrl] = useState(null);

  const getImage = async () => {
    const res = await axios.get(url, {
      responseType: "blob",
    });
    return res.data;
  };

  const { data, isError, isLoading } = useQuery({
    queryKey: ["image", { name }],
    queryFn: getImage,
    throwOnError: false,
  });

  useEffect(() => {
    if (data) {
      const objUrl = URL.createObjectURL(data);
      setObjectUrl(objUrl);
      return () => URL.revokeObjectURL(objUrl);
    }
    return () => URL.revokeObjectURL(objectUrl);
  }, [data]);

  if (!isStringNotEmpty(url) || isError) return <FallbackImg />;
  if (isLoading) return <p>Loading...</p>;

  return <img src={objectUrl} alt={name} />;
}
