## DAO (Data Access Object) ##
**alias**: `data layer`, `infrastructure`

### Overview ###
This `README` file describes the key guidelines for designing the data layer of an application. It will help to understand how the data layer fits into the application architecture, the components it usually contains, and the key issues you face when designing the data layer.


### General Design Considerations ###
1. **Data access technology.**
 - RESTful Web services accessed over HTTP
 - Offline Storage (SessionStorage)
 - FileSystem (URL storage can store about 2000 characters)

2. **Interface of data access layer.**
 - get (fetch, getItem)
 - list (fetch)
 - create (set, save, setItem)
 - update (set, save, setItem)
 - delete (remove, removeItem, clear)

 TODO: Designing single approach of Interface to the data access layer

3. **Encapsulate data access functionality within the data access layer.**
 The data access layer should hide the details of data source access.
 It should be responsible for 
 - managing connections
 - generating queries
 - mapping application entities to data source structures.

4. **Map application entities to data source structures.**
 All mappers, parsers, translators are into 'domain/parsers' folder.
 DAO has access to these files and can use them.

5. **Manage connections.**
 As a rule, the data access layer should create and manage all connections to all data sources required by the application. Connection managershould be responsible for open and close connections, storing and protecting connection information.

6. **Data exceptions.**

### Specific Design Issues ###
- Batching
- Connections/Transactions
- Data Format
- Exception Management
- Object Relational Mapping
- Queries
- Validation
