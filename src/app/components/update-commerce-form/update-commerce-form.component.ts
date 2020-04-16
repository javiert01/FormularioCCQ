import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, NgZone } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MapsAPILoader } from '@agm/core';
import { CategoryService } from 'src/app/services/category.service';
import { Router } from '@angular/router';

declare let google: any;

@Component({
  selector: 'app-update-commerce-form',
  templateUrl: './update-commerce-form.component.html',
  styleUrls: ['./update-commerce-form.component.css']
})
export class UpdateCommerceFormComponent implements OnInit {

  updateCommerceForm: FormGroup;
  formData = new FormData();
  lat = -0.1840506;
  lng = -78.503374;
  markLat;
  markLng;
  mapZoom = 18;
  message;
  selectedFile;
  imgURL;
  imagenSubida;
  reciboURL;
  imagenSeleccionada;
  commerce;
  direccion;
  updateClicked = false;
  url = 'http://50.28.58.84:8080/apiTodoMasCerca/api/commerce-upload';

  commerceCategories = [];
  invalidControls = [];
  frecuencyOptions = [
    'Lunes a Viernes',
    'Lunes a Sábado',
    'Solo fines de semana',
    'Todos los días'
  ];

  @ViewChild('search', { static: true })
  public searchElementRef: ElementRef;
  public searchControl: FormControl;

  constructor(private http: HttpClient, private cdRef: ChangeDetectorRef,
    private mapsAPILoader: MapsAPILoader, private ngZone: NgZone,
    private categoryService: CategoryService,
    private router: Router) { }

  ngOnInit() {
    this.loadCategoryData();
    this.updateCommerceForm = new FormGroup({
      RUC: new FormControl(null, [Validators.required, Validators.pattern(new RegExp('^[0-9]*$'))]),
      category: new FormControl('', Validators.required),
      frecuency: new FormControl('', Validators.required),
      hourOpen: new FormControl(null, [
        Validators.required,
        this.onCheckLesserTime.bind(this)
      ]),
      hourClose: new FormControl(null, [
        Validators.required,
        this.onCheckGreaterTime.bind(this)
      ]),
      address: new FormControl(null, Validators.required),
      lng: new FormControl(null),
      ltd: new FormControl(null),
      reference: new FormControl(null, Validators.required),
      commerceDescription: new FormControl(null, [
        Validators.required,
        Validators.maxLength(90)
      ]),
    });

    this.imgURL = '../../../assets/06-no-image.png';
    this.markLat = this.lat;
    this.markLng = this.lng;
    this.searchControl = new FormControl();
    this.mapsAPILoader.load().then(() => {
      const autocomplete = new google.maps.places.Autocomplete(
        this.searchElementRef.nativeElement,
        {
          types: ['address']
        }
      );
      autocomplete.setComponentRestrictions({
        country: ['ec']
      });
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          this.mapZoom = 18;
          this.lat = place.geometry.location.lat();
          this.lng = place.geometry.location.lng();
          this.markLat = this.lat;
          this.markLng = this.lng;
          this.updateCommerceForm.get('ltd').setValue(this.markLat);
          this.updateCommerceForm.get('lng').setValue(this.markLng);
          this.getAddress(this.lat, this.lng);
        });
      });
    });

    this.updateCommerceForm
    .get('RUC')
    .valueChanges.subscribe(data => {
      if (data.length > 13) {
        this.cdRef.detectChanges();
        this.updateCommerceForm
          .get('RUC')
          .setValue(data.substring(0, 13));
      }
    });

    this.updateCommerceForm.valueChanges.subscribe(data => {
      this.findInvalidControls();
      this.translateControls(this.invalidControls);
    });
  }

  loadCategoryData() {
    this.categoryService.getCategoryList().subscribe((data: any) => {
      this.commerceCategories = data;
    });
  }

  onCheckGreaterTime(control: FormControl): { [s: string]: boolean } {
    if (control.value && this.updateCommerceForm.get('hourOpen').value) {
      if (
        this.minutesOfDay(control.value) <
        this.minutesOfDay(this.updateCommerceForm.get('hourOpen').value)
      ) {
        return { hourGreatError: true };
      }
    }
    return null;
  }

  onCheckLesserTime(control: FormControl): { [s: string]: boolean } {
    if (control.value && this.updateCommerceForm.get('hourClose').value) {
      if (
        this.minutesOfDay(control.value) >
        this.minutesOfDay(this.updateCommerceForm.get('hourClose').value)
      ) {
        return { hourLessError: true };
      }
    }
    return null;
  }

  minutesOfDay(m) {
    m = this.convertTime12to24(m);
    const hourMinutesClose = m.split(':');
    const hours = Number(hourMinutesClose[0]);
    const minutes = Number(hourMinutesClose[1]);
    return minutes + hours * 60;
  }

  convertTime12to24(time12h) {
    const [time, modifier] = time12h.split(' ');

    let [hours, minutes] = time.split(':');

    if (hours === '12') {
      hours = '00';
    }

    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }

    return `${hours}:${minutes}`;
  }

  findInvalidControls() {
    const controls = this.updateCommerceForm.controls;
    this.invalidControls = [];
    for (const name in controls) {
      if (controls[name].invalid) {
        this.invalidControls.push(name);
      }
    }
  }

  translateControls(controls) {
    for (let i = 0; i < controls.length; i++) {
      switch (controls[i]) {
        case 'ownerName':
          controls[i] = 'Nombre';
          break;
        case 'ownerLastName':
          controls[i] = 'Apellido';
          break;
        case 'phone':
          controls[i] = 'Télefono Celular';
          break;
        case 'commerceName':
          controls[i] = 'Nombre del comercio';
          break;
        case 'category':
          controls[i] = 'Categoría';
          break;
        case 'frecuency':
          controls[i] = 'Días de apertura';
          break;
        case 'hourOpen':
          controls[i] = 'Horario de apertura';
          break;
        case 'hourClose':
          controls[i] = 'Horario de cierre';
          break;
        case 'city':
          controls[i] = 'Ciudad';
          break;
        case 'address':
          controls[i] = 'Dirección exacta';
          break;
        case 'reference':
          controls[i] = 'Referencia';
          break;
        case 'commerceDescription':
          controls[i] = 'Breve descripción';
          break;
        case 'useConditions':
          controls[i] = 'Políticas de uso';
          break;
        case 'ownerEmail':
          controls[i] = 'Correo electrónico';
      }
    }
  }

  onSetCityMap(city) {
    console.log(city);
    if (city === '17: Francisco de Orellana') {
      city = 'Orellana';
    }
    city = city + ', EC';
    const geocoder = new google.maps.Geocoder();
    const self = this;
    geocoder.geocode(
      {
        address: city
      },
      function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          self.lat = results[0].geometry.location.lat();
          self.lng = results[0].geometry.location.lng();
          self.markLat = results[0].geometry.location.lat();
          self.markLng = results[0].geometry.location.lng();
          self.updateCommerceForm.get('ltd').setValue(self.markLat);
          self.updateCommerceForm.get('lng').setValue(self.markLng);
          self.mapZoom = 11;
          console.log(self.lat);
          self.cdRef.detectChanges();
        } else {
          alert('Something got wrong ' + status);
        }
      }
    );
  }

  setMarker($event) {
    // console.log($event.coords.lat);
    this.markLat = $event.coords.lat;
    this.markLng = $event.coords.lng;
    this.updateCommerceForm.get('ltd').setValue(this.markLat);
    this.updateCommerceForm.get('lng').setValue(this.markLng);
  }

  getAddress(lat: number, lng: number) {
    console.log('Finding Address');
    if (navigator.geolocation) {
      const geocoder = new google.maps.Geocoder();
      const latlng = new google.maps.LatLng(lat, lng);
      const request = { latLng: latlng };
      geocoder.geocode(request, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          const result = results[0];
          const rsltAdrComponent = result.address_components;
          const resultLength = rsltAdrComponent.length;
          if (result != null) {
            this.direccion = result.formatted_address;
            this.updateCommerceForm.get('address').setValue(this.direccion);
          } else {
            alert(
              'No hay dirección disponible en este momento, llenela manualmente'
            );
          }
        }
      });
    }
  }

  getGeoLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          this.mapZoom = 18;
          this.lat = pos.lat;
          this.lng = pos.lng;
          this.markLat = pos.lat;
          this.markLng = pos.lng;
          this.updateCommerceForm.get('ltd').setValue(this.markLat);
          this.updateCommerceForm.get('lng').setValue(this.markLng);
          this.getAddress(this.lat, this.lng);
        },
        () => {}
      );
    } else {
      alert(
        'Tu navegador no soporta geolocalización! Selecciona tu dirección manualmente'
      );
    }
  }

  parseHour(hour) {
    let hourString = hour.toString();

    if (hour < 10) {
      hourString = '0' + hour.toString();
    }
    return hourString;
  }

  submitCommerce() {
    this.commerce = {
      'id': this.updateCommerceForm.get('RUC').value,
      'hourOpen': this.updateCommerceForm.get('hourOpen').value,
      'hourClose': this.updateCommerceForm.get('hourClose').value,
      'frequency': this.updateCommerceForm.get('frecuency').value,
      'category': this.updateCommerceForm.get('category').value,
      'address': this.updateCommerceForm.get('address').value,
      'location': `{type: 'Point',coordinates: [${this.updateCommerceForm.get('lng').value},${this.updateCommerceForm.get('ltd').value}]}`,
      'reference': this.updateCommerceForm.get('reference').value,
      'commerceDescription': this.updateCommerceForm.get('commerceDescription').value,
      'acceptTermsConditions': true
    };
    this.formData.append('data', JSON.stringify(this.commerce));
    this.http.post(this.url + '/', this.formData).subscribe(
      (data) => {
        this.router.navigate(['/gracias']);
      },
      (err) => console.error(err)
    );
  }

  onFileChangedRecibo(event) {
    // console.log("Cambio de valor en el bolean: ", this.imagenSubida);
    this.imagenSubida = true;
    // console.log("Cambio de valor en el bolean 2: ", this.imagenSubida);
    this.selectedFile = event.target.files[0];
    this.imagenSeleccionada = true;
    // console.log("OnFileChanged", this.selectedFile);
    if (event.target.files.length === 0) {
      this.imagenSeleccionada = false;
      this.imgURL = '../../../assets/06-no-image.png';
      return;
    }
    const mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = 'Solo se permite subir imágenes!';
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    this.formData.append('file', event.target.files[0], event.target.files[0].name);
    reader.onload = _event => {
      this.reciboURL = reader.result.toString();
    };
  }

  onUpdateClicked() {
    this.updateClicked = true;
    this.updateCommerceForm.disable();
  }

  onCancelUpdate() {
    this.updateClicked = false;
    this.updateCommerceForm.enable();
  }

}
