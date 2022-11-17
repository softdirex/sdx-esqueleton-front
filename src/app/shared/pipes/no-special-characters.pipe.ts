import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'no-special-characters'
})
export class NoSpecialCharactersPipe implements PipeTransform {
    transform(arg: string): string {
        return arg.replace(/[^a-zA-Z\u00C0-\u00ff- 0-9]/g, '');
    }
}