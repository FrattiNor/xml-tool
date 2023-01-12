export type Map = Record<string, string>;
export type XmlJSON = Record<string, string | Map | XmlJSON[]>;
export type XmlTreeItem = { tag: string; attrs: Map; child: XmlTreeItem[]; origin: any; id: string };
export type XmlTree = XmlTreeItem[];
