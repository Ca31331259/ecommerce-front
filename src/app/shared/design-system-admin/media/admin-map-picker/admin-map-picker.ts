import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';

import * as L from 'leaflet';

export interface MapPosition {

  lat: number;

  lng: number;

}

/**
 * Fix del ícono default de Leaflet: por default arma las URLs de los PNG
 * relativas al bundle (esbuild), lo que rompe. Apuntamos directo a los
 * assets que angular.json copia a /assets/leaflet/ (ver
 * node_modules/leaflet/dist/images).
 */
const DEFAULT_ICON = L.icon({

  iconUrl: 'assets/leaflet/marker-icon.png',
  iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
  shadowUrl: 'assets/leaflet/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]

});

// Buenos Aires — solo el centro inicial cuando todavía no hay pin cargado.
const DEFAULT_CENTER: MapPosition = {

  lat: -34.6037,
  lng: -58.3816

};

const ZOOM_WITH_PIN = 15;

const ZOOM_WITHOUT_PIN = 5;

@Component({
  selector: 'admin-map-picker',
  standalone: true,
  templateUrl: './admin-map-picker.html',
  styleUrl: './admin-map-picker.scss'
})
export class AdminMapPicker implements AfterViewInit, OnChanges, OnDestroy {

  @Input()
  latitude?: number | null;

  @Input()
  longitude?: number | null;

  @Output()
  readonly positionChange =
    new EventEmitter<MapPosition>();

  @ViewChild('mapContainer', { static: true })
  private mapContainer!: ElementRef<HTMLDivElement>;

  private map?: L.Map;

  private marker?: L.Marker;

  private resizeObserver?: ResizeObserver;

  ngAfterViewInit(): void {

    const initialPosition = this.currentPosition();

    this.map = L.map(this.mapContainer.nativeElement).setView(
      initialPosition ?? DEFAULT_CENTER,
      initialPosition ? ZOOM_WITH_PIN : ZOOM_WITHOUT_PIN
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {

      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19

    }).addTo(this.map);

    if (initialPosition) {

      this.placeMarker(initialPosition);

    }

    this.map.on('click', (event: L.LeafletMouseEvent) => {

      const position: MapPosition = {

        lat: event.latlng.lat,
        lng: event.latlng.lng

      };

      this.placeMarker(position);

      this.positionChange.emit(position);

    });

    // El contenedor suele no tener su tamaño final cuando corre este hook
    // (está adentro de un tab / admin-form-card que recién se muestra), así
    // que Leaflet calcula mal el viewport y solo carga tiles para una franja.
    // invalidateSize() en el próximo tick lo recalcula; el ResizeObserver
    // cubre además el caso de que el contenedor cambie de tamaño después
    // (cambio de tab, resize de ventana).
    setTimeout(() => this.map?.invalidateSize(), 0);

    if (typeof ResizeObserver !== 'undefined') {

      this.resizeObserver = new ResizeObserver(() => {
        this.map?.invalidateSize();
      });

      this.resizeObserver.observe(this.mapContainer.nativeElement);

    }

  }

  /**
   * Solo reposiciona el pin — no toca center/zoom acá para no "saltar" el
   * mapa después de cada click (el propio click ya deja la vista donde el
   * admin la dejó; este hook también dispara con el round-trip de
   * [latitude]/[longitude] que el padre actualiza a partir de ese mismo click).
   */
  ngOnChanges(changes: SimpleChanges): void {

    if (!this.map) {

      return;

    }

    if (!changes['latitude'] && !changes['longitude']) {

      return;

    }

    const position = this.currentPosition();

    if (position) {

      this.placeMarker(position);

      return;

    }

    if (this.marker) {

      this.marker.remove();

      this.marker = undefined;

    }

  }

  ngOnDestroy(): void {

    this.resizeObserver?.disconnect();

    this.map?.remove();

  }

  private currentPosition(): MapPosition | null {

    if (this.latitude == null || this.longitude == null) {

      return null;

    }

    return {

      lat: this.latitude,
      lng: this.longitude

    };

  }

  private placeMarker(position: MapPosition): void {

    if (!this.map) {

      return;

    }

    if (!this.marker) {

      this.marker = L.marker(position, {

        icon: DEFAULT_ICON,
        draggable: true

      }).addTo(this.map);

      this.marker.on('dragend', () => {

        const latLng = this.marker!.getLatLng();

        this.positionChange.emit({

          lat: latLng.lat,
          lng: latLng.lng

        });

      });

      return;

    }

    this.marker.setLatLng(position);

  }

}
