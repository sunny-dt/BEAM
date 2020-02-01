import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class UserRolesService {

  public SuperAdmin: string = 'Super_Admin';
	public BuilderAdmin: string = 'Builder_Admin';
	public ExplorerAdmin: string = 'Explorer_Admin';
	public AnalyticsAdmin: string = 'Analytics_Admin';
	public MapperAdmin: string = 'Mapper_Admin';
	public BuilderUser: string = 'Builder_User';
	public ExplorerUser: string = 'Explorer_User';
	public AnalyticsUser: string = 'Analytics_User';
  public MapperUser: string = 'Mapper_User';

  constructor() {}
}