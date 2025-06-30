import {Timestamp} from "@t/Timestamp.ts";

export default function time(): Timestamp {
	return new Date().getTime();
}