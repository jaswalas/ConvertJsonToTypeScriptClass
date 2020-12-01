type JSON = IUST

interface IUST {
  id: string;
  type: string;
  name: string;
  image: IImage;
  thumbnail: Array<IThumbnail>;
}

interface IImage {
  url: string;
  width: number;
  height: number;
}

interface IThumbnail {
  url: string;
  width: number;
  height: number;
}
