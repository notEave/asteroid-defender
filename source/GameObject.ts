import { List } from './List';
import { ArrayList } from './ArrayList';
import { Component } from './Component';

export class GameObject {
  private readonly components:List<Component>;

  public constructor() {
    this.components = new ArrayList<Component>();
  }

  public addComponent(component:Component):void {
    this.components.put(component);
  }

  public getComponent<T extends Component>():T {
    this.components.forEach(v => {
      if(v instanceof T)
    })
  }
}
