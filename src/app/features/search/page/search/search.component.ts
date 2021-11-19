import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  people = [
    {
      id: '46188243',
      name: 'Luis',
      lastname: 'Osorio',
      area: 'Direccion general de administracion',
      puesto: 'Analista',
      clave: 'G-1308',
    },
    {
      id: '46188243',
      name: 'Luis',
      lastname: 'Osorio',
      area: 'Direccion general de administracion',
      puesto: 'Analista',
      clave: 'G-1308',
    },
    {
      id: '46188243',
      name: 'Luis',
      lastname: 'Osorio',
      area: 'Direccion general de administracion',
      puesto: 'Analista',
      clave: 'G-1308',
    },
    {
      id: '46188243',
      name: 'Luis',
      lastname: 'Osorio',
      area: 'Direccion general de administracion',
      puesto: 'Analista',
      clave: 'G-1308',
    },
    {
      id: '46188243',
      name: 'Luis',
      lastname: 'Osorio',
      area: 'Direccion general de administracion',
      puesto: 'Analista',
      clave: 'G-1308',
    },
    {
      id: '46188243',
      name: 'Luis',
      lastname: 'Osorio',
      area: 'Direccion general de administracion',
      puesto: 'Analista',
      clave: 'G-1308',
    },
    {
      id: '46188243',
      name: 'Luis',
      lastname: 'Osorio',
      area: 'Direccion general de administracion',
      puesto: 'Analista',
      clave: 'G-1308',
    },


  ]

  constructor() { }

  ngOnInit(): void {
  }

  register(option: string) {
    Swal.fire({
      title: `¿Confirmar voto por ${option}`,
      showDenyButton: true,
      // showCancelButton: true,
      denyButtonText: `Cancelar`,
      confirmButtonText: 'Registar',
      confirmButtonColor: '#00d203',
      reverseButtons: true
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.fire('Voto registrado', 'Se imprimira el comprobante', 'success')
      }
    })
  }
}
