import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { ResponseData } from "src/app/shared/responseData.model";
import { RecipeService } from "../recipes/recipe.service";


@Injectable()
export class RecipeGetResolverService implements Resolve<ResponseData>{
    constructor(private recipeService: RecipeService) { }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): ResponseData | Observable<ResponseData> | Promise<ResponseData> {
        return this.recipeService.getRecipeFromServer(route.params['id']);
    }
}