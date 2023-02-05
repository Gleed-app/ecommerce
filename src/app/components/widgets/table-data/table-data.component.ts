import { IMarque, IShoppingProduct } from 'src/app/core/interface';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { AppFacades } from 'src/app/facades/app.facades';
import { HttpRequestType } from 'src/app/core/enum';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-table-data',
  templateUrl: './table-data.component.html',
  styleUrls: ['./table-data.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableDataComponent implements OnInit {
  @Input() headers!: string[];
  @Input() datas: any[] = [];
  @Input() buttons: string[] = ['modifier', 'supprimer'];
  @Input() type: string = 'command';
  @Input() filter: boolean = true;
  @Output() updateEvent = new EventEmitter<boolean>();

  category: string = '';
  marques: Omit<IMarque, 'id' | 'isActive'>[] = [];

  constructor(private appFacades: AppFacades) {}

  ngOnInit(): void {
    this.getMarques();
  }

  getCategorie(event: string) {
    this.category = event;
  }

  createControl(value: number | string) {
    return new FormControl(value == '1' || value == 1 ? true : false);
  }

  getMarques() {
    this.appFacades.getMarques().subscribe((response: any) => {
      response.data.forEach((element: any) => this.marques.push(element.name));
      console.log(this.marques);
    });
  }

  delete(guid: string) {
    this.appFacades.deleteProduct(guid).subscribe({
      next: (response: any) => {
        this.appFacades.alertSuccess(response.message);
        this.updateEvent.emit(true);
      },
      error: (err: any) => {
        this.appFacades.alertError(err.message);
        console.log(err);
      },
      complete: () => {},
    });
  }
}
