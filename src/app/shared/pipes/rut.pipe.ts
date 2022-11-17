import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'rut'
})
export class RutPipe implements PipeTransform {
    transform(arg: string): string {
        return arg.split('.').join('');
    }
}