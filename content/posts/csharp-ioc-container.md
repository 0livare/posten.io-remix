---
title: Building an IoC container in C#
description: The design and implementation of an Inversion of Control container in C#
author: Zach Posten
date: 2017-11-15
tags: csharp, ioc, mvvm
slug: csharp-ioc-container
---

## Purpose

An IoC container is an essential part of any MVVM framework. Its purpose is to allow objects to explicitly declare, via the constructor, their dependencies, and have those dependencies automagically supplied to them; this pattern is known as dependency injection. The alternative to dependency injection is to allow each object to create its own dependencies. This does not allow for the sharing of those objects, but more fatally, doing so makes testing very difficult. By injecting interfaces into a class under test (as opposed to concrete objects), the developer can then write tests that inject mock implementations into the class, facilitating thorough testing.

An IoC container is also a very clean way of instating objects. Instead of having run-on lines where you pass a long list of objects into a constructor, you can simply ask the IoC container to give you an instance of the object. Using the objects that it already has stored, or those that it knows how to create, the container automatically calls the constructor, and supplies you with the object.

## Phase 1

### Design

In designing and implementing this container, I went through a few phases. In the first one here, let's look at the simplest possible implementation. At the very least, our container needs to be able to store objects, and retrieve objects. Let's call those methods `Register`, and `Resolve`.

```csharp
interface IIocContainer
{
    void Register(Type typeToResolve, object concreteObject);
    object Resolve(Type typeToResolve);
}
```

Admittedly, the name `IIocContainer` is a little awkward, but I don't feel as though `IocContainer` conveys very well that it's an interface. So we'll make due.

### Implementation

When the user asks us to store a type, they give us a type, and an object. When they want to retrieve an object, they give us that same type back. We pretty much have a key value pair relationship here, so a `Dictionary<Type, object>` seems like a logical data structure to use for our underlying implementation.

```csharp
class SimpleIocContainer : IIocContainer
{
    private readonly Dictionary<Type, object> registeredObjects = new Dictionary<Type, object>();

    public void Register(Type typeToResolve, object concreteObject)
    {
        registeredObjects.Add(typeToResolve, concreteObject);
    }

    public object Resolve(Type typeToResolve)
    {
        return registeredObjects[typeToResolve];
    }
}
```

Usage:

```csharp
IIocContainer container = new SimpleIocContainer();
container.Register(typeof(MyModel), new MyModel());
//... somewhere else
MyModel model = container.Resolve(typeof(MyModel));
```

To make the container a bit easier to use, we can declare some extension methods that allow the use of generics. Notice that the extension methods are created for the interface, so that they could be used for any implementation of `IIocContainer`.

```csharp
static class ContainerExtensions {
    public T Resolve<T>()
    {
        return (T) Resolve(typeof(T));
    }

    public void Register<T>(object concreteObject)
    {
        Register(typeof(T), concreteObject);
    }
}
```

Usage:

```csharp
IIocContainer container = new SimpleIocContainer();
container.Register<MyModel>(new MyModel());
//... somewhere else
MyModel model = container.Resolve<MyModel>();
```

Well hey, that was pretty easy! There are definitely some improvements that could be made here though. What if the user were to call `Register` again, with a different object? Also, this doesn't do any of the fancy magic object instantiation that we talked about earlier. Let's look at solving these problems and more in phase 2.

## Phase 2

### Design

The big improvement that we want to make in our second go at this is to allow our container to instantiate objects on command. There are several pieces to this:

- Dynamically calling the constructor of a class involves using reflection to detect the types that it's asking for, and searching the types that have already been registered with the container in order to fulfill those dependencies.
- Managing the life cycle of those objects. When should the objects be instantiated?
  - There are times when you would want the object instantiated immediately (instance)
  - When you want it instantiated only upon request and never again (singleton)
  - And when you want a new version of the object instantiated every time the type is requested (per request)

```csharp
internal interface IIocContainer
{
    IIocContainer Instance  (Type serviceType, object concreteObject);
    IIocContainer Singleton (Type implementationType, Type serviceType = null);
    IIocContainer PerRequest(Type implementationType, Type serviceType = null);
    object Resolve(Type t);
}
```

### Implementation

When we begin the implementation, one of the first issues that we're going to run into is somehow indicating to the `Resolve` method how it should go about fetching the requested object. If I have a type, but no concrete object, that could either indicate that I should make it once and store it, or that I should instantiate it without storing it.

Additionally, you'll run into issues if the same type was used with calls to different methods. If it was first stored as an instance and then per request, unless you made sure (for the per request) to check to see if an instance already existed and remove it, if you were using the existence of a stored object as your flag, you would never create another instance, even though the last thing the user asked for was for you to create the object anew every time it was requested.

To "resolve" these issues, we'll define a `ResolutionInfo` class that stores the necessary data to correctly instantiate the objects.

```csharp
private class ResolutionInfo
{
    public Type TypeToInstantiate { get; set; }
    public object Instance { get; set; }
    public bool CreatePerRequest { get; set; }
    public bool CreateOnce { get; set; }

    private ResolutionInfo() { }

    public static ResolutionInfo PerRequestInfo(Type typeToInstantiate = null)
    {
        return new ResolutionInfo
        {
            TypeToInstantiate = typeToInstantiate,
            CreatePerRequest = true,
        };
    }

    public static ResolutionInfo SingletonInfo(Type typeToInstantiate = null)
    {
        return new ResolutionInfo
        {
            TypeToInstantiate = typeToInstantiate,
            CreateOnce = true,
        };
    }

    public static ResolutionInfo InstanceInfo(object instance)
    {
        return new ResolutionInfo
        {
            Instance = instance,
        };
    }
}
```

Notice that we don't allow a `ResolutionInfo` object to be created externally, instead forcing the use of three static methods that return a `ResolutionInfo` instance. Notice the properties of this class. In addition to flags that indicate how and when the object should be created, there is also a field to hold the object instance after creation.

Not let's look at how we use it. To make it more understandable, we'll break the explanation up into several pieces.

#### The basics

The first things that we're going to need are a place to store our objects, and something that knows how to created instances of things on demand.

```csharp
class SimpleIocContainer : IIocContainer
{
    private readonly Dictionary<Type, ResolutionInfo> _registeredObjects = new Dictionary<Type, ResolutionInfo>();
    private readonly IInstantiator _instantiator;

    public SimpleIocContainer()
    {
        _instantiator = new Instantiator(this);

        // Allow this container to be requested from itself
        Instance(typeof(IIocContainer), this);
    }
}
```

Notice that just like before we're using a `Dictionary` to hold our instances. The only difference this time is that the values are of type `ResolutionInfo`. Recall from earlier that `ResolutionInfo` has an `Instance` property that will be used to hold the object that we're interested in accessing.

The `IInstantiator` is a simple interface that allows for the creation of any type:

```csharp
interface IInstantiator
{
    object CreateInstance(Type t);
}
```

Finally, the constructor. It simply creates an instance of our `Instantiator` object (we'll look at how this is implemented later) and stores itself so that if some viewmodel wants to explicitly use the IoC container, it is able to do so.

The constructor could take an optional instance of `IInstantiator`, itself supporting dependency injection, the pattern that the container is part of. If that instance is not provided, it would default to our local implementation.

#### The Instance method

The `Instance` method is the simplest of the four. It's purpose is to store an already created object for later retrieval. Taking in a type and the already instantiated object, it creates an instance version of the `ResolutionInfo` with this object, and stores it in the dictionary with the type as a key.

```csharp
public IIocContainer Instance(Type serviceType, object concreteObject)
{
    _registeredObjects[serviceType] = ResolutionInfo.InstanceInfo(concreteObject);
    return this;
}
```

Notice that the method returns the container so that method calls can be chained together.

#### The Singleton method

The `Singleton` method's purpose is to create an instance of an object upon request, but only once. And subsequent calls to retrieve that same type will receive the same instance.

```csharp
public IIocContainer Singleton(Type implementationType, Type serviceType = null)
{
    if (serviceType == null) serviceType = implementationType;

    _registeredObjects[serviceType] = ResolutionInfo.SingletonInfo(implementationType);
    return this;
}
```

Instead of taking a concrete object, it takes two types; one of them being optional. The implementation type is the type of the object that is to be instantiated. It cannot be an interface or an abstract class. I didn't explicitly check for that here, but you could. The service type is the key you want to use to store this object. This will typically be an interface that the implementation type implements.

#### The PerRequest method

The `PerRequest` method is rather boring to look at by now, it is nearly identical to the `Singleton` method apart from the type of `ResolutionInfo` that it stores.

```csharp
public IIocContainer PerRequest(Type implementationType, Type serviceType = null)
{
    if (serviceType == null) serviceType = implementationType;

    _registeredObjects[serviceType] = ResolutionInfo.PerRequestInfo(implementationType);
    return this;
}
```

#### The Resolve method

The purpose of the resolve method is to give back the user the object they have stored in the container. This method could logically be called `GetInstance`, but `Resolve` is the old standard.

```csharp
public object Resolve(Type serviceType)
{
    _registeredObjects.TryGetValue(serviceType, out ResolutionInfo info);
    if (info == null) return null;

    if (!info.CreatePerRequest && !info.CreateOnce) return info.Instance;
    object inst = _instantiator.CreateInstance(info.TypeToInstantiate);

    if (info.CreateOnce)
    {
        info.Instance = inst;
        info.CreateOnce = false;
    }

    return inst;
}
```

The first thing we do is get the stored `ResolutionInfo`. If we don't find one, that means that no object has been stored with the passed service type, so we return null.

Next we need to determine if we should instantiate an instance or not. If this info is not supposed to be created every time it's requested, and it's also not marked to be created this once, then we fetch the type and return it. Otherwise, we ask the `IInstantiator` to instantiate an instance of the implementation type for us.

Finally, if the `ResolutionInfo` specified that the object was only supposed to be created once, we store the created instance and mark that it has already been created this once, and should not be created again.

If the info is marked as `CreatePerRequest`, then this instance will not be stored, and the same thing will happen the next time we call `Resolve`.

#### The Instantiator

There is a bit of complexity in how you go about dynamically creating objects, ensuring that their constructor's are passed all the objects that they require, in the proper order. This sounds like a job for System.Reflection! Let's just look at the entire class at once this time, I think you're ready for it.

```csharp
internal  class Instantiator : IInstantiator
{
    private readonly IIocContainer _container;
    public Instantiator(IIocContainer container) { _container = container; }

    public object CreateInstance(Type t)
    {
        return CreateInstance(t, true) ?? CreateInstance(t, false);
    }

    private object CreateInstance(Type t, bool requireAllParameters)
    {
        foreach (ConstructorInfo ctor in t.GetConstructors())
        {
            object inst = CreateInstance(t, ctor, requireAllParameters);
            if (inst != null) return inst;
        }
        return null;
    }

    private object CreateInstance(
        Type t,
        ConstructorInfo ctor,
        bool requireAllParameters)
    {
        ParameterInfo[] paramInfos = ctor.GetParameters();
        object[] parameters = paramInfos.Select(info => info.ParameterType)
                                        .Select(_container.Resolve)
                                        .Where(o => !requireAllParameters || o != null)
                                        .ToArray();

        return parameters.Length == paramInfos.Length
            ? Activator.CreateInstance(t, parameters)
            : null;
    }
}
```

The first thing to note is that the constructor takes an `IIocContainer`, which is what we'll use to get the dependencies of the type we're trying to instantiate. That is a bit circular, but it makes sense when you think about it.

As you can see, we have three overloads of the same method here. The first, public one takes only a type. It makes two calls to the second method, first requiring all parameters, and then if that couldn't be done (was `null`), without requiring all the constructor's parameters.

The second method loops through all the types constructors, seeing if we can fulfill any of them. It returns the first successfully created object.

The third method is really where the magic :rabbit::tophat: happens. For the constructor that we are trying to fulfill, we go through each of its parameters. For each parameter we try and fetch it from the `IIocContainer`. If the type was not successfully fetched from the IoC (was `null`), the we have a decision to make:

- If we are requiring all parameters, then we filter out this parameter, which will cause the length of the available parameters to be different from the number of parameters required by the constructor, which in tern will cause `null` to be returned from this method.
- If we are _not_ requiring all parameters, then we simply supply `null` for this parameter. This could be an issue if a constructor took an integral type, then this would throw an exception because `null` is not a valid value for an integral type. This could be improved to instead use `default(info.ParameterType)`.

#### Extension methods

Those are all the necessary pieces of a robust IoC container! However, passing types to methods can get annoying fast, so similarly to before, we can define some extension methods to make using the IoC easier.

```csharp
internal static class IocContainerExtensions
{
    public static IIocContainer Instance<TService>(this IIocContainer container, object concreteObject)
    {
        return container.Instance(typeof(TService), concreteObject);
    }


    public static IIocContainer Singleton<TImplementation>(this IIocContainer container)
    {
        return container.Singleton(typeof(TImplementation));
    }
    public static IIocContainer Singleton<TService, TImplementation>(this IIocContainer container)
    {
        return container.Singleton(typeof(TImplementation), typeof(TService));
    }


    public static IIocContainer PerRequest<TImplementation>(this IIocContainer container)
    {
        return container.PerRequest(typeof(TImplementation));
    }
    public static IIocContainer PerRequest<TService, TImplementation>(this IIocContainer container)
    {
        return container.PerRequest(typeof(TImplementation), typeof(TService));
    }


    public static TService Resolve<TService>(this IIocContainer container)
    {
        return (TService)container.Resolve(typeof(TService));
    }
}
```

As you can see, each one of these is simply generic, and uses `typeof` to pass the `Type` parameters of the regular methods.

However, there is one more extension method that I think can be useful here:

```csharp
public static TService CreateAndStore<TService>(this IIocContainer container)
{
    return container.Singleton<TService>().Resolve<TService>();
}
```

This method allows you to immediately create an instance of an object, without having to manually call its constructor, and also have it already stored in your IoC container, neat!

## Summary

In this, somewhat lengthy, post, we've looked at how to build a robust inversion of control container. The code samples were all in C#, but these same ideas can certainly be applied to any language.

One of the most common use cases for an IoC container is within an MVVM framework, but I think there is a lot of value in it outside of MVVM as well, simply as a way of managing object instances that you want to share/define throughout your application.
