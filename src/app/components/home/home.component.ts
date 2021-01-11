import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component, OnInit, ViewChild } from '@angular/core';
import { TwitterService } from '../../services/twitter.service';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})




export class HomeComponent implements OnInit {
  public twettsService: any[] = [];
  public rowTwetts: any = [];
  public stringSerch: string = '';
  public temparray: any[] = [];
  @ViewChild( CdkVirtualScrollViewport, {static:true} ) viewport: CdkVirtualScrollViewport;

  constructor(private twtService: TwitterService) {

  }
  ngOnInit(): void {
    this.twtService.serchTimeline().subscribe((resp: any) => {
      this.twettsService = resp.statuses;
      this.rowTwettsGenerator(this.twettsService, 0);
    });
  }
  buscarTwetts(value: any, tipeSerch: number) {
    this.stringSerch = value;
    this.twtService.serchTweets(value).subscribe((resp: any) => {
      this.twettsService = resp.statuses;
      this.rowTwettsGenerator(this.twettsService,tipeSerch);
    });
  }

  rowTwettsGenerator(arrawTwetts: any, tipeSerch: number){
    if (tipeSerch == 0 ) {
      this.rowTwetts = [] ;
    }  
    if (arrawTwetts.length != 0) {
      let rowNum = this.countRow(arrawTwetts, 3), posicion: number = 0;
      for (let index = 0; index < Number(rowNum); index++) {
        this.rowTwetts = [...this.rowTwetts, arrawTwetts.slice(posicion, posicion + 3)];
        posicion += 3;
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No existen registros para esta busqueda!'
      })
    }
  }
  countRow(array: any[], numRow: number) {
    return Math.ceil(array.length / numRow);
  }

  cortar(cadena: string, caracteres: number) {
    if (cadena) {
      return (cadena.length > caracteres ? cadena.substring(0, caracteres) + "..." : cadena);
    } else return cadena;
  }
  retwett(idTwett: string) {
    this.twtService.retweetPost(idTwett).subscribe((resp: any) => {
      console.log(resp);
    });
  }
  favorite(idTwett: string) {
    this.twtService.favoritePost(idTwett).subscribe((resp: any) => {
      console.log(resp);
    });
  }
  validateScroll(event: any) {
    const end = this.viewport.getRenderedRange().end;
    const total = this.viewport.getDataLength();
    if (end == total) {
      this.buscarTwetts(this.stringSerch, 1);
    }

  }
  keyPress(event: KeyboardEvent) {
    
    const pattern = /^[a-zA-Z0-9. '-]+$/;
    if (!pattern.test(event.key)) {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 800,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })

      Toast.fire({
        icon: 'error',
        title: 'No se pertite este caracter.'
      })

      event.preventDefault();
    };
  }
}
