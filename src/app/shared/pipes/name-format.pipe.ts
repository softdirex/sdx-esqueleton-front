import { TitleCasePipe } from "@angular/common";
import { Pipe, PipeTransform } from "@angular/core";
import { NoSpecialCharactersPipe } from "./no-special-characters.pipe";

@Pipe({
    name: 'nameformat'
})
export class NameFormatPipe implements PipeTransform {
    transform(arg: string): string {
        const noSpChars: NoSpecialCharactersPipe = new NoSpecialCharactersPipe()
        const titecase: TitleCasePipe = new TitleCasePipe()
        return titecase.transform(noSpChars.transform(arg))
    }
}