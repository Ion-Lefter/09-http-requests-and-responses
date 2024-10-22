import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit{

  places = signal<Place[] | undefined>(undefined);
  isFetching = signal(false);
  error = signal('');
  private placesService = inject(PlacesService);
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.isFetching.set(true);
    const subscription = this.placesService.loadAvailablePlaces()
    .subscribe({
      next: (places) =>{
        this.places.set(places)
        console.log(places);
      },
      error: (error) => {
        this.error.set(error.message);
      },
      complete: () => {
        this.isFetching.set(false);
      }
      })
      this.destroyRef.onDestroy(() => {
        subscription.unsubscribe();
    });
  }

  onSelectPlace(selectedPlace: Place){
   const subscription = this.placesService.addPlaceToUserPlaces(selectedPlace.id).subscribe({
      next: (resData: any) => console.log(resData)
    });
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    })
  }
}
